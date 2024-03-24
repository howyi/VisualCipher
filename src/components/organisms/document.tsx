import * as React from 'react'
import { Button } from '@/components/ui/button'
import {
  DoubleArrowRightIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { useDocumentPathStore } from '@/docs/use-document-path'
import { Pages } from '@/docs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { DocumentLink } from '@/docs/document-link'
import { Fragment } from 'react'
import { Link } from 'gatsby'

type Props = {
  onClose: () => void
}

export function Document({ onClose }: Props) {
  const path = useDocumentPathStore((state) => state.path)
  return (
    <div
      className={
        'border-l-2 py-4 px-14 flex flex-col gap-2 w-[500px] h-screen overflow-y-scroll'
      }
    >
      <Button
        className={'flex flex-row gap-2 py-2'}
        variant={'ghost'}
        size={'sm'}
        onClick={onClose}
      >
        <DoubleArrowRightIcon />
        close
      </Button>
      <div className={'flex flex-row gap-2 pb-2'}>
        <Button size={'sm'} className={'w-full flex flex-row gap-2'} asChild>
          <a
            className={'flex-1 no-underline'}
            href={'https://github.com/howyi/visual-cipher'}
            target={'_blank'}
          >
            <GitHubLogoIcon /> source code
          </a>
        </Button>
        <Button size={'sm'} className={'w-full flex flex-row gap-2'} asChild>
          <a
            className={'flex-1 no-underline'}
            href={'https://twitter.com/howyi_lq'}
            target={'_blank'}
          >
            <TwitterLogoIcon /> @howyi_lq
          </a>
        </Button>
      </div>
      {Pages[path] && (
        <>
          <Breadcrumb>
            <BreadcrumbList>
              {Pages[path].breadcrumbs.map((k) => (
                <Fragment key={k}>
                  <BreadcrumbItem>
                    {k == 'top_reload' ? (
                      <Link to={'/'}>top</Link>
                    ) : (
                      <DocumentLink to={k}>{k}</DocumentLink>
                    )}
                  </BreadcrumbItem>
                  <BreadcrumbSeparator />
                </Fragment>
              ))}
              <BreadcrumbItem>{path}</BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>

          <div className={'prose-sm prose dark:prose-invert '}>
            {Pages[path].component}
          </div>
        </>
      )}
    </div>
  )
}
