// react-resizable-panels is not installed. This stub prevents a
// 'Cannot find module' TypeScript error on Vercel. If you ever need
// real resizable panels, run: npm install react-resizable-panels
import * as React from "react";

export function ResizablePanelGroup({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function ResizablePanel({
  className,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={className} {...props}>
      {children}
    </div>
  );
}

export function ResizableHandle({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return <div className={className} {...props} />;
}
