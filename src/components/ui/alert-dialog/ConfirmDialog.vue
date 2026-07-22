<script setup lang="ts">
import AlertDialog from './AlertDialog.vue'
import AlertDialogAction from './AlertDialogAction.vue'
import AlertDialogCancel from './AlertDialogCancel.vue'
import AlertDialogContent from './AlertDialogContent.vue'
import AlertDialogDescription from './AlertDialogDescription.vue'
import AlertDialogFooter from './AlertDialogFooter.vue'
import AlertDialogHeader from './AlertDialogHeader.vue'
import AlertDialogTitle from './AlertDialogTitle.vue'
import {
  confirmState,
  handleCancel,
  handleConfirm,
  handleOpenChange,
} from './use-confirm'
</script>

<template>
  <AlertDialog :open="confirmState.open" @update:open="handleOpenChange">
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{{ confirmState.title }}</AlertDialogTitle>
        <AlertDialogDescription v-if="confirmState.description">
          {{ confirmState.description }}
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel @click="handleCancel">
          {{ confirmState.cancelText }}
        </AlertDialogCancel>
        <AlertDialogAction :variant="confirmState.confirmVariant" @click="handleConfirm">
          {{ confirmState.confirmText }}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
</template>
