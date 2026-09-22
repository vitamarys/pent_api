import Script from 'next/script'
import s from './ElfsightReviews.module.scss'

export default function ElfsightReviews() {
  return (
    <div className={s.wrap}>
      <Script src="https://elfsightcdn.com/platform.js" strategy="lazyOnload" />
      <div
        className="elfsight-app-b5e84504-fe6f-43bc-aae8-3e338c43be34"
        data-elfsight-app-lazy
      />
    </div>
  )
}
