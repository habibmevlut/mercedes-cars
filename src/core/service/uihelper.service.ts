import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
    providedIn: 'root'
})
export class UIHelperService {

    constructor(
        private snackBar: MatSnackBar
    ) {
    }


    /**
     * Shows a snackbar message.
     * @param message
     */
    showSnackBarMessage(message: string) {
        this.snackBar.open(
            message,
            'OK',
            {
                verticalPosition: 'top',
                horizontalPosition: 'center',
                duration: 3000
            }
        );
    }
}
