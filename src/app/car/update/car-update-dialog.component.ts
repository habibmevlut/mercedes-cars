import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CurrencyPipe } from '@angular/common';
import { ColorService } from '../../color/service/color.service';
import { IColor } from '../../color/color.model';
import { finalize, map, Observable, startWith } from 'rxjs';
import { ICar, NewCar } from '../car.model';
import { CarService } from '../service/car.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIHelperService } from '../../../core/service/uihelper.service';

@Component({
    selector: 'app-car-update-dialog',
    templateUrl: './car-update-dialog.component.html',
    styleUrls: ['./car-update-dialog.component.scss']
})
export class CarUpdateDialogComponent implements OnInit {
    creatAndEditCarForm: FormGroup | undefined;
    colors: IColor[] = [];
    filteredColors: Observable<IColor[]> | undefined;
    carData: ICar | undefined;
    isUpdate = false;
    isSaving: boolean = false;

    displayFn(color: IColor): string {
        return color && color.name ? color.name : '';
    }

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<CarUpdateDialogComponent>,
        private currencyPipe: CurrencyPipe,
        private colorService: ColorService,
        private carService: CarService,
        private uiHelperService: UIHelperService,
        @Inject(MAT_DIALOG_DATA) data: { car: ICar },
    ) {
        this.carData = data.car;
        this.isUpdate = !!this.carData?.id;
    }

    ngOnInit() {
        this.initForm();
        this.loadColors();

        this.filteredColors = this.creatAndEditCarForm?.controls['color'].valueChanges.pipe(
            startWith(''),
            map(value => {
                const name = typeof value === 'string' ? value : value?.name;
                return name ? this.filterColors(name as string) : this.colors.slice();
            })
        );

        this.creatAndEditCarForm?.valueChanges.subscribe(form => {
            if (form.price) {
                this.creatAndEditCarForm?.patchValue({
                    price: this.currencyPipe.transform(form.price.replace(/\D/g, '').replace(/^0+/, ''), 'EUR', 'symbol', '1.0-0', 'en')
                }, {emitEvent: false})
            }
        })
    }

    /**
     * Filter colors by name.
     * @param value
     * @private
     */
    private filterColors(value: string): IColor[] {
        const filterValue = value?.toLowerCase();
        return this.colors.filter(color => color.name?.toLowerCase().startsWith(filterValue));
    }

    /**
     * Initialize form group.
     * @private
     */
    private initForm() {
        this.creatAndEditCarForm = this.formBuilder.group({
            id: new FormControl({value: this.carData?.id ? this.carData.id : null, disabled: true}),
            carId: new FormControl({value: this.carData?.carId ? this.carData.carId : null, disabled: this.isUpdate}, {
                validators: [Validators.required],
            }),
            hp: new FormControl(this.carData?.hp ? this.carData.hp : null, {
                validators: [Validators.required, this.hpRangeValidator],
            }),
            price: new FormControl(this.carData?.price ? this.carData.price : null, {
                validators: [Validators.required],
            }),
            color: new FormControl(this.carData?.color ? this.carData.color : null, {
                validators: [Validators.required],
            }),
            inStock: new FormControl(this.carData?.inStock ? this.carData.inStock : null),
        });
    }

    /**
     * HP range validator.
     * @param control
     * @private
     */
    private hpRangeValidator(control: AbstractControl): ValidationErrors | null {
        const value = parseInt(control.value, 10);
        if (isNaN(value) || value < 100 || value > 550) {
            return {range: true};
        }
        return null;
    }

    /**
     * Only numeric value entered.
     * @param event
     * @private
     */
    protected numberOnly(event: any): boolean {
        const charCode = (event.which) ? event.which : event.keyCode;
        return !(charCode > 31 && (charCode < 48 || charCode > 57));
    }

    protected loadColors(): void {
        this.colorService.query()
            .subscribe({
                next: (res) => {
                    if (res.body !== null && res.body !== undefined) {
                        this.colors = res.body;
                    } else {
                        this.colors = [];
                    }
                }
            });
    }

    save() {
        if (this.creatAndEditCarForm?.invalid || this.isSaving) {
            return;
        }
        this.isSaving = true;
        const formData = this.creatAndEditCarForm?.getRawValue() as ICar | NewCar;

        if (formData.id) {
            this.carService.update(formData)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (res) => {
                        if (res.ok) {
                            this.dialogRef.close(res.body);
                            this.uiHelperService.showSnackBarMessage('Car updated successfully')
                        }
                    },
                    error: () => {
                        this.isSaving = false;
                        this.uiHelperService.showSnackBarMessage('Error while updating car');
                    }
                });
        } else {
            this.carService.create(formData as NewCar)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (res) => {
                        if (res.ok) {
                            this.dialogRef.close(res.body);
                            this.uiHelperService.showSnackBarMessage('Car saved successfully');
                        }
                    },
                    error: () => {
                        this.isSaving = false;
                        this.uiHelperService.showSnackBarMessage('Error while saving car');
                    },
                });
        }
    }

}
