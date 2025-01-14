import { AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

const DeleteDialog = () => {
  return (
    <AlertDialogContent className="bg-white">
      <AlertDialogHeader>
        <AlertDialogTitle className="text-primary">Você tem certeza?</AlertDialogTitle>
        <AlertDialogDescription>
          Essa ação não pode ser desfeita. Isso excluirá permanentemente esse
          evento e todos os dados relacionados.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>Cancelar</AlertDialogCancel>
        <AlertDialogAction>Deletar</AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>

  );
}

export default DeleteDialog;