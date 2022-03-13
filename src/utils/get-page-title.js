import defaultSettings from '@/settings'

const title = defaultSettings.title || '白洋淀成果展示大屏管理后台'

export default function getPageTitle(pageTitle) {
  if (pageTitle) {
    return `${pageTitle} - ${title}`
  }
  return `${title}`
}
