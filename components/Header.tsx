import siteMetadata from '@/data/siteMetadata'
import headerNavLinks from '@/data/headerNavLinks'
import Image from 'next/image'
import Link from './Link'
import MobileNav from './MobileNav'
import ThemeSwitch from './ThemeSwitch'
import SearchButton from './SearchButton'

const Header = () => {
  let headerClass = 'flex items-center w-full bg-white dark:bg-gray-950 justify-between py-10'
  if (siteMetadata.stickyNav) {
    headerClass += ' sticky top-0 z-50'
  }

  return (
    <header className={headerClass}>
      <Link href="/" aria-label={siteMetadata.headerTitle}>
        <div className="flex items-center gap-0.5 sm:gap-1">
          <div className="flex h-[88px] w-[88px] items-center justify-center sm:h-[104px] sm:w-[104px] md:h-32 md:w-32">
            <Image
              src={siteMetadata.siteLogo}
              alt={`${siteMetadata.headerTitle} logo`}
              width={128}
              height={128}
              className="h-full w-full dark:hidden"
            />
            <Image
              src={siteMetadata.siteLogoDark}
              alt={`${siteMetadata.headerTitle} logo`}
              width={128}
              height={128}
              className="hidden h-full w-full dark:block"
            />
          </div>

          {typeof siteMetadata.headerTitle === 'string' ? (
            <div className="text-2xl leading-none font-semibold sm:text-3xl md:text-4xl">
              {siteMetadata.headerTitle}
            </div>
          ) : (
            siteMetadata.headerTitle
          )}
        </div>
      </Link>
      <div className="flex items-center space-x-4 leading-5 sm:-mr-6 sm:space-x-6">
        <div className="no-scrollbar hidden max-w-40 items-center gap-x-4 overflow-x-auto sm:flex md:max-w-72 lg:max-w-96">
          {headerNavLinks
            .filter((link) => link.href !== '/')
            .map((link) => (
              <Link
                key={link.title}
                href={link.href}
                className="hover:text-primary-500 dark:hover:text-primary-400 m-1 font-medium text-gray-900 dark:text-gray-100"
              >
                {link.title}
              </Link>
            ))}
        </div>
        <SearchButton />
        <ThemeSwitch />
        <MobileNav />
      </div>
    </header>
  )
}

export default Header
