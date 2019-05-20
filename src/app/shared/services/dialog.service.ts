import { Injectable, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { Subscription } from 'rxjs';
import { MediaChange, MediaObserver } from '@angular/flex-layout';

@Injectable({
  providedIn: 'root'
})
export class DialogService implements OnDestroy {
  private mediaUpdatesSubscription: Subscription;
  private dialogRefId: string;

  constructor(
    private dialog: MatDialog, 
    private mediaObserver: MediaObserver
  ) {
    this.mediaUpdatesSubscription = mediaObserver.media$.subscribe(
      (change: MediaChange) => {
        const dialogRef = this.dialog.getDialogById(this.dialogRefId);
        if (dialogRef) {
          if (change.mqAlias === 'xs') {
            dialogRef.updateSize('100%', '100%');
          } else {
            dialogRef.updateSize('400px');
          }
        }
      }
    );
  }

  ngOnDestroy() {
    this.mediaUpdatesSubscription.unsubscribe();
  }

  open(component, options?) {
    this.closeAll();
    const defaultOptions = this.mediaObserver.isActive('gt-xs')
      ? {
          width: '400px'
        }
      : {
          maxWidth: '100vw',
          maxHeight: '100vh',
          height: '100%',
          width: '100%'
        };
    const dialogRef = this.dialog.open(
      component,
      Object.assign(defaultOptions, options || {})
    );
    this.dialogRefId = dialogRef.id;
    return dialogRef;
  }

  closeAll() {
    this.dialog.closeAll();
  }
}
