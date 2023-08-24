import { Component, OnInit } from '@angular/core';
import { IColor } from '../color.model';
import { ColorService } from '../service/color.service';
import { finalize } from 'rxjs';
import { UIHelperService } from '../../../core/service/uihelper.service';
import { ColorUpdateDialogComponent } from '../update/color-update-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../../../core/component/confirmation-dialog/confirmation-dialog.component';

@Component({
    selector: 'app-color',
    templateUrl: './color.component.html',
    styleUrls: ['./color.component.scss']
})
export class ColorComponent implements OnInit {
    isLoading = false;
    colors: IColor[] = [];
    displayedColumns: string[] = ['id', 'name', 'code', 'color', 'actions'];


    constructor(
        private colorService: ColorService,
        private uiHelperService: UIHelperService,
        private matDialog: MatDialog,
    ) {
    }

    ngOnInit(): void {
        this.load();
    }


    load(): void {
        this.isLoading = true;
        this.colorService.query()
            .pipe(finalize(() => (this.isLoading = false)))
            .subscribe({
                next: (res) => {
                    if (res.body !== null && res.body !== undefined) {
                        this.colors = res.body;
                    } else {
                        this.colors = [];
                    }
                },
                error: () => {
                    this.isLoading = false;
                    this.uiHelperService.showSnackBarMessage('Error while loading colors');
                }
            });
    }

    showColorUpdateDialog(selectedColor?: IColor): void {
        this.matDialog
            .open(ColorUpdateDialogComponent, {
                data: {
                    color: selectedColor,
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

    delete(element: IColor): void {
        const dialogRef = this.matDialog.open(ConfirmationDialogComponent, {
            width: '300px',
        });

        dialogRef.afterClosed().subscribe(result => {
            if (result && element.id) {
                this.colorService.delete(element.id)
                    .subscribe({
                        next: (res) => {
                            if (res.ok) {
                                this.uiHelperService.showSnackBarMessage('Color deleted successfully');
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
