import type { Placement } from '@floating-ui/react'
import {
  FloatingPortal,
  autoUpdate,
  flip,
  offset,
  shift,
  useDismiss,
  useFloating,
  useFocus,
  useHover,
  useInteractions,
  useMergeRefs,
  useRole,
} from '@floating-ui/react'
import {
  type HTMLProps,
  type ReactElement,
  type ReactNode,
  type Ref,
  cloneElement,
  createContext,
  forwardRef,
  isValidElement,
  useContext,
  useMemo,
  useState,
} from 'react'

interface TooltipOptions {
  placement?: Placement
  isOpen?: boolean
  onOpenChange?: (isOpen: boolean) => void
}

type UseTooltipReturn = ReturnType<typeof useTooltip>

export function useTooltip({
  placement = 'top',
  isOpen: controlledOpen,
  onOpenChange: setControlledOpen,
}: TooltipOptions = {}): {
  open: boolean
  setOpen: (open: boolean) => void
  refs: {
    setReference: (node: HTMLElement | null) => void
    setFloating: (node: HTMLElement | null) => void
  }
  floatingStyles: React.CSSProperties
  context: unknown
  getReferenceProps: (userProps?: React.HTMLProps<Element>) => React.HTMLProps<Element>
  getFloatingProps: (userProps?: React.HTMLProps<HTMLElement>) => React.HTMLProps<HTMLElement>
} {
  const [unControlledOpen, setUnControlledOpen] = useState(false)

  const open = controlledOpen ?? unControlledOpen
  const setOpen = setControlledOpen ?? setUnControlledOpen

  const data = useFloating({
    placement,
    open,
    onOpenChange: setOpen,
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(5),
      flip({
        crossAxis: placement.includes('-'),
        fallbackAxisSideDirection: 'start',
        padding: 5,
      }),
      shift({ padding: 5 }),
    ],
  })

  const context = data.context

  const hover = useHover(context, {
    move: false,
    enabled: controlledOpen == null,
  })
  const focus = useFocus(context, {
    enabled: controlledOpen == null,
  })
  const dismiss = useDismiss(context)
  const role = useRole(context, { role: 'tooltip' })

  const interactions = useInteractions([hover, focus, dismiss, role])

  return useMemo(
    () => ({
      open,
      setOpen,
      ...interactions,
      ...data,
    }),
    [open, setOpen, interactions, data],
  )
}

type ContextType = UseTooltipReturn | null

const TooltipContext = createContext<ContextType>(null)

export const useTooltipContext = () => {
  const context = useContext(TooltipContext)

  if (context == null) {
    throw new Error('Tooltip components must be wrapped in <Tooltip />')
  }

  return context
}

export function Tooltip({ children, ...options }: { children: ReactNode } & TooltipOptions) {
  const tooltip = useTooltip(options)
  return <TooltipContext.Provider value={tooltip}>{children}</TooltipContext.Provider>
}

type ElementWithRef = ReactElement & { ref?: Ref<unknown> }

export const TooltipTrigger = forwardRef<
  HTMLElement,
  HTMLProps<HTMLElement> & { asChild?: boolean }
>(function TooltipTrigger({ children, asChild = false, ...props }, propRef) {
  const context = useTooltipContext()

  if (!children || !isValidElement(children)) {
    return null
  }

  const childrenElement: ElementWithRef = children
  const childrenRef = childrenElement.ref ?? null
  const ref = useMergeRefs([context.refs.setReference, propRef, childrenRef])

  if (asChild) {
    return cloneElement(
      childrenElement,
      context.getReferenceProps({
        ref,
        ...props,
        ...childrenElement.props,
        'data-state': context.open ? 'open' : 'closed',
      }),
    )
  }

  return cloneElement(
    childrenElement,
    context.getReferenceProps({
      ref,
      ...props,
      ...childrenElement.props,
      'data-state': context.open ? 'open' : 'closed',
    }),
  )
})

export const TooltipContent = forwardRef<
  HTMLElement,
  { children: ReactNode } & HTMLProps<HTMLElement>
>(function TooltipContent({ children, ...props }, propRef) {
  const context = useTooltipContext()
  const ref = useMergeRefs([context.refs.setFloating, propRef])

  if (!context.open) return null

  if (!children || !isValidElement(children)) {
    return null
  }

  const childrenElement: ReactElement = children

  return (
    <FloatingPortal>
      {cloneElement(childrenElement, {
        ref,
        style: {
          ...context.floatingStyles,
          ...childrenElement.props.style,
        },
        ...context.getFloatingProps(props),
        ...childrenElement.props,
      })}
    </FloatingPortal>
  )
})
