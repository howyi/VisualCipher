import React, { PropsWithChildren } from 'react'

export function GuideWrapper({
  to,
  children,
}: { to: string } & PropsWithChildren) {
  return (
    <div className={'flex flex-col gap-2'}>
      {/*<Alert>*/}
      {/*  <AlertDescription>*/}
      {/*    You can add and delete modules on this page, but the settings you*/}
      {/*    create are not saved. If you wish to save your work, please use the{' '}*/}
      {/*    <Link to={'/'}>VisualCipher Playground</Link>.*/}
      {/*  </AlertDescription>*/}
      {/*</Alert>*/}
      {/*<OpenOnVisualCipherButton to={to} />*/}
      <div>{children}</div>
    </div>
  )
}
