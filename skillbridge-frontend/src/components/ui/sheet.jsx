import * as React from "react"
import { createPortal } from "react-dom"
import { motion, AnimatePresence } from "framer-motion"
import { X } from "lucide-react"
import { cn } from "../../lib/utils"

const Sheet = ({ children }) => {
  const [open, setOpen] = React.useState(false)
  return (
    <SheetContext.Provider value={{ open, setOpen }}>
      {children}
    </SheetContext.Provider>
  )
}

export const SheetContext = React.createContext(null)

const SheetTrigger = React.forwardRef(({ asChild, children, ...props }, ref) => {
  const { setOpen } = React.useContext(SheetContext)
  return React.cloneElement(children, {
    onClick: () => setOpen(true),
    ref,
    ...props,
  })
})

const SheetContent = ({ side = "right", className, children, ...props }) => {
  const { open, setOpen } = React.useContext(SheetContext)

  const content = (
    <AnimatePresence mode="wait">
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-black/50 backdrop-blur-[6px] cursor-pointer"
          />
          <motion.div
            initial={{ x: side === "right" ? "100%" : "-100%", opacity: 0.5 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: side === "right" ? "100%" : "-100%", opacity: 0.5 }}
            transition={{ duration: 0.4, ease: [0.32, 0.72, 0, 1] }}
            className={cn(
              "fixed z-[70] p-6 shadow-2xl transition-colors",
              side === "right" ? "inset-y-0 right-0 h-full w-full sm:w-[350px] border-l border-zinc-800" : "inset-y-0 left-0 h-full w-full sm:w-[350px] border-r border-zinc-800",
              className
            )}
            {...props}
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute right-6 top-6 rounded-full p-2 bg-zinc-900/50 hover:bg-zinc-800 transition-colors text-white active:scale-90"
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </button>
            {children}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )

  return createPortal(content, document.body)
}

const Separator = React.forwardRef(({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
  <div
    ref={ref}
    role={decorative ? "none" : "separator"}
    aria-orientation={orientation === "horizontal" ? "horizontal" : "vertical"}
    className={cn(
      "shrink-0 bg-slate-200 dark:bg-zinc-800",
      orientation === "horizontal" ? "h-[1px] w-full" : "h-full w-[1px]",
      className
    )}
    {...props}
  />
))
Separator.displayName = "Separator"

export { Sheet, SheetTrigger, SheetContent, Separator }
