import * as React from 'react'
import { Fragment } from 'react'
import { Button } from '@/components/ui/button'
import {
  DoubleArrowDownIcon,
  GitHubLogoIcon,
  TwitterLogoIcon,
} from '@radix-ui/react-icons'
import { useDocumentPathStore } from '@/docs/use-document-path'
import { Pages } from '@/docs'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbSeparator,
} from '@/components/ui/breadcrumb'
import { DocumentLink } from '@/docs/document-link'
import { Link } from 'gatsby'

type Props = {
  onClose: () => void
}

export function Document({ onClose }: Props) {
  const path = useDocumentPathStore((state) => state.path)
  return (
    <div
      className={
        'md:border-l-2 py-4 px-14 flex flex-col gap-2 md:w-[500px] w-screen md:h-screen md:overflow-y-scroll'
      }
    >
      <div className={'md:hidden m-auto'}>
        <DoubleArrowDownIcon />
      </div>
      <div className={'hidden md:flex flex-row gap-2 pb-2'}>
        <Button
          variant={'outline'}
          size={'sm'}
          className={'w-full flex flex-row gap-2'}
          asChild
        >
          <a
            className={'flex-1 no-underline'}
            href={'https://github.com/howyi/visual-cipher'}
            target={'_blank'}
          >
            <GitHubLogoIcon /> source code
          </a>
        </Button>
        <Button
          variant={'outline'}
          size={'sm'}
          className={'w-full flex flex-row gap-2'}
          asChild
        >
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
                      <Link className={'underline'} to={'/'}>
                        top
                      </Link>
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
