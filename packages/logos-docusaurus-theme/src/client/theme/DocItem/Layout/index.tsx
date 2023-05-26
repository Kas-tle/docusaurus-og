import React from 'react'
import clsx from 'clsx'
import { useWindowSize } from '@docusaurus/theme-common'
import { useDoc } from '@docusaurus/theme-common/internal'
import DocItemPaginator from '@theme/DocItem/Paginator'
import DocVersionBanner from '@theme/DocVersionBanner'
import DocVersionBadge from '@theme/DocVersionBadge'
import DocItemFooter from '@theme/DocItem/Footer'
import DocItemTOCMobile from '@theme/DocItem/TOC/Mobile'
import DocItemTOCDesktop from '@theme/DocItem/TOC/Desktop'
import DocItemContent from '@theme/DocItem/Content'
import DocBreadcrumbs from '@theme/DocBreadcrumbs'
import styles from './styles.module.css'

/**
 * Decide if the toc should be rendered, on mobile or desktop viewports
 */
export function useDocTOC() {
  const { frontMatter, toc } = useDoc()
  const windowSize = useWindowSize()
  const hidden = frontMatter.hide_table_of_contents
  const canRender = !hidden && toc.length > 0
  const mobile = canRender ? <DocItemTOCMobile /> : undefined
  const desktop =
    canRender && (windowSize === 'desktop' || windowSize === 'ssr') ? (
      <DocItemTOCDesktop />
    ) : undefined

  return {
    hidden,
    mobile,
    desktop,
  }
}

export default function DocItemLayout({ children }) {
  const docTOC = useDocTOC()

  return (
    <div className={clsx('row', styles.docItemGrid)}>
      <div className={clsx(!docTOC.hidden && styles.docItemCol)}>
        <DocVersionBanner />
        <div className={styles.docItemContainer}>
          <article>
            <DocBreadcrumbs />
            <DocVersionBadge />
            {docTOC.mobile}
            <DocItemContent>{children}</DocItemContent>
            <DocItemFooter />
          </article>
          <DocItemPaginator />
        </div>
      </div>
      <div className={styles.gap1} />
      {docTOC.desktop && (
        <div className={clsx(styles.toc)}>{docTOC.desktop}</div>
      )}
    </div>
  )
}
