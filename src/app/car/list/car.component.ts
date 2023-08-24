import { Component, OnInit } from '@angular/core';
import { ICar } from '../car.model';
import { CarService } from '../service/car.service';
import { finalize } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { CarUpdateDialogComponent } from '../update/car-update-dialog.component';
import { FormGroup } from '@angular/forms';
import { ConfirmationDialogComponent } from '../../../core/component/confirmation-dialog/confirmation-dialog.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { UIHelperService } from '../../../core/service/uihelper.service';

@Component({
    selector: 'app-car',
    templateUrl: './car.component.html',
    styleUrls: ['./car.component.scss'],
})
export class CarComponent implements OnInit {
    displayedColumns: string[] = ['id', 'carId', 'inStock', 'hp', 'price', 'color', 'actions'];
    cars?: ICar[];
    isLoading = false;

    constructor(
        protected carService: CarService,
        private matDialog: MatDialog,
        private snackBar: MatSnackBar,
        private uiHelperService: UIHelperService
    ) {
    }

    ngOnInit(): void {
        this.load();
    }

    /**
     * Load all cars.
     */
    load(): void {
        this.isLoading = true;
        this.carService.query()
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: (res) => {
                    if (res.body !== null && res.body !== undefined) {
                        this.cars = res.body;
                    } else {
                        this.cars = [];
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.uiHelperService.showSnackBarMessage('Error while loading cars');
                },
                complete: () => {
                    this.isLoading = false;
                }
            });
    }

    /**
     * Show car update dialog.
     * @param selectedCar
     */
    showCarUpdateDialog(selectedCar?: ICar): void {
        this.matDialog
            .open(CarUpdateDialogComponent, {
                data: {
                    car: selectedCar,
                },
                width: '500px',
                disableClose: true,
            })
            .afterClosed()
            .subscribe((result) => {
                if (result) {
                    this.load();
                }
            });
    }

    /**
     * Delete a car.
     * @param element
     */
    delete(element: ICar): void {
        const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
            width: '300px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && element.id) {
                this.carService.delete(element.id)
                    .subscribe({
                        next: (res) => {
                            if (res.ok) {
                                this.uiHelperService.showSnackBarMessage('Car deleted successfully');
                                this.load();
                            }
                        },
                        error: () => {
                            this.uiHelperService.showSnackBarMessage('Error while deleting car');
                        }
                    })
            }
        });
    }
}
