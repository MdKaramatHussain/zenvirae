'use client'

import { useToast } from '@/hooks/use-toast'
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from '@/components/ui/toast'
import { CheckCircle, AlertCircle, AlertTriangle } from 'lucide-react'

export function Toaster() {
  const { toasts } = useToast()

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, ...props }) {
        const variant = (props as any).variant ?? 'default'
        let Icon = null
        if (variant === 'success') Icon = <CheckCircle className="h-5 w-5 text-white" />
        if (variant === 'error' || variant === 'destructive') Icon = <AlertCircle className="h-5 w-5 text-white" />
        if (variant === 'warning') Icon = <AlertTriangle className="h-5 w-5 text-black" />

        return (
          <Toast key={id} {...(props as any)}>
            <div className="flex items-start gap-4">
              <div className="mt-0.5 flex-shrink-0">{Icon}</div>
              <div className="grid gap-1">
                {title && (
                  <ToastTitle className={variant === 'default' ? undefined : 'text-white font-bold'}>
                    {title}
                  </ToastTitle>
                )}
                {description && (
                  <ToastDescription className={variant === 'default' ? undefined : variant === 'warning' ? 'text-black' : 'text-white/90'}>
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className={variant === 'default' ? undefined : 'text-white/70'} />
          </Toast>
        )
      })}
      <ToastViewport />
    </ToastProvider>
  )
}
