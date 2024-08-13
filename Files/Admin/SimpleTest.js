import React from 'react'
import { Button } from "@/Files/Admin/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/Files/Admin/ui/alert-dialog";

const SimpleTest = () => {
    
  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant='secondary'>Open Dialog</Button>
        
      </AlertDialogTrigger>

      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Test Dialog</AlertDialogTitle>
          <AlertDialogDescription>
            This is a test dialog.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel >Cancel</AlertDialogCancel>
          <AlertDialogAction>Confirm</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export default SimpleTest
