import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

import { UIHelperService } from '../../../core/service/uihelper.service';
import { finalize } from 'rxjs';
import { ColorService } from '../service/color.service';
import { IColor, NewColor } from '../color.model';

@Component({
    selector: 'app-color-update-dialog',
    templateUrl: './color-update-dialog.component.html',
    styleUrls: ['./color-update-dialog.component.scss']
})
export class ColorUpdateDialogComponent implements OnInit {
    isSaving: boolean = false;
    creatAndEditColorForm: FormGroup | undefined;
    colorData: IColor | undefined;

    constructor(
        private formBuilder: FormBuilder,
        private dialogRef: MatDialogRef<ColorUpdateDialogComponent>,
        private colorService: ColorService,
        private uiHelperService: UIHelperService,
        @Inject(MAT_DIALOG_DATA) data: { color: IColor },
    ) {
        this.colorData = data.color;
    }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm(): void {
        this.creatAndEditColorForm = this.formBuilder.group({
            id: new FormControl(this.colorData?.id ? this.colorData.id : null),
            name: new FormControl(this.colorData?.name ? this.colorData.name : null, [Validators.required]),
            code: new FormControl(this.colorData?.code ? this.colorData.code : null, [Validators.required]),
        });
    }

    save() {
        if (this.creatAndEditColorForm?.invalid || this.isSaving) {
            return;
        }
        this.isSaving = true;
        const colorFormData = this.creatAndEditColorForm?.getRawValue() as IColor | NewColor;

        if (colorFormData.id) {
            this.colorService.update(colorFormData)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (res) => {
                        if (res.ok) {
                            this.dialogRef.close(res.body);
                            this.uiHelperService.showSnackBarMessage('Color updated successfully')
                        }
                    },
                    error: () => {
                        this.isSaving = false;
                        this.uiHelperService.showSnackBarMessage('Error while updating color');
                    }
                });
        } else {
            this.colorService.create(colorFormData as NewColor)
                .pipe(finalize(() => (this.isSaving = false)))
                .subscribe({
                    next: (res) => {
                        if (res.ok) {
                            this.dialogRef.close(res.body);
                            this.uiHelperService.showSnackBarMessage('Color saved successfully');
                        }
                    },
                    error: () => {
                        this.isSaving = false;
                        this.uiHelperService.showSnackBarMessage('Error while saving color');
                    },
                });
        }
    }
}
