import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

type DeleteConfirmationDialogProps = {
  open: boolean;
  isDeleting: boolean;
  itemLabel: string;
  itemDetails: string;
  onClose: () => void;
  onConfirm: () => void;
};

export function DeleteConfirmationDialog({
  open,
  isDeleting,
  itemLabel,
  itemDetails,
  onClose,
  onConfirm,
}: DeleteConfirmationDialogProps) {
  return (
    <AlertDialog
      open={open}
      onOpenChange={(value) => {
        if (!value) {
          onClose();
        }
      }}
    >
      <AlertDialogContent className="bg-gradient-to-br from-black via-gray-900 to-black border border-amber-500/40 text-white">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-amber-300">{itemLabel ? `حذف ${itemLabel}` : 'تأكيد الحذف'}</AlertDialogTitle>
          <AlertDialogDescription className="text-gray-300 leading-relaxed">
            {itemLabel ? (
              <span>
                سيتم حذف {itemLabel}
                {itemDetails && <span className="font-semibold text-amber-200"> {itemDetails}</span>}
                . هذا الإجراء لا يمكن التراجع عنه وسيتم إزالة البيانات نهائياً.
              </span>
            ) : (
              'هذا الإجراء لا يمكن التراجع عنه وسيتم إزالة البيانات نهائياً.'
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="gap-2">
          <AlertDialogCancel
            disabled={isDeleting}
            onClick={onClose}
            className="bg-gray-800/80 text-gray-200 border-gray-700 hover:bg-gray-700/80"
          >
            تراجع
          </AlertDialogCancel>
          <AlertDialogAction
            disabled={isDeleting}
            onClick={onConfirm}
            className="bg-gradient-to-r from-amber-500 via-amber-600 to-amber-500 text-black font-semibold hover:from-amber-400 hover:via-amber-500 hover:to-amber-400"
          >
            {isDeleting ? 'جارٍ الحذف...' : 'تأكيد الحذف'}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
