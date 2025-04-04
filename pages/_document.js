import { Html, Head, Main, NextScript } from "next/document";
import YandexMetrika from '../components/YandexMetrika'
import React from 'react'
// import Script from 'next/script'

export default function Document() {
  const analyticsEnabled = process.env.NODE_ENV === 'production'

  return (
    <Html lang="ru">
      <Head>
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="yandex-verification" content="0e55abe9e66d0033" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.8.0/dist/leaflet.css"
          integrity="sha512-hoalWLoI8r4UszCkZ5kL8vayOGVae1oxXe/2A4AO6J9+580uKHDO3JdHb7NzwwzK5xr/Fs0W40kiNHxM9vyTtQ=="
          crossOrigin=""
        />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="true"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Jost:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </Head>
      <body>
        <Main />
        <NextScript />
        <YandexMetrika enabled={analyticsEnabled} />
        {/*<script type="text/javascript" >*/}
        {/*  (function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};*/}
        {/*  m[i].l=1*new Date();*/}
        {/*  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}*/}
        {/*  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})*/}
        {/*  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");*/}

        {/*  ym(97806971, "init", {*/}
        {/*  clickmap:true,*/}
        {/*  trackLinks:true,*/}
        {/*  accurateTrackBounce:true,*/}
        {/*  webvisor:true*/}
        {/*});*/}
        {/*</script>*/}
        {/*<noscript><div><img src="https://mc.yandex.ru/watch/97806971" style="position:absolute; left:-9999px;" alt="" /></div></noscript>*/}
        {/*<script*/}
        {/*  dangerouslySetInnerHTML={{*/}
        {/*    __html: `*/}
				{/*				(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};*/}
        {/*  m[i].l=1*new Date();*/}
        {/*  for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}*/}
        {/*  k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})*/}
        {/*  (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");*/}

        {/*  ym(97806971, "init", {*/}
        {/*  clickmap:true,*/}
        {/*  trackLinks:true,*/}
        {/*  accurateTrackBounce:true,*/}
        {/*  webvisor:true*/}
        {/*});*/}
				{/*			`*/}
        {/*  }}*/}
        {/*/>*/}
        {/*<Script id="metrika-counter" strategy="afterInteractive">*/}
        {/*  {`(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};*/}
        {/*    m[i].l=1*new Date();*/}
        {/*    for (var j = 0; j < document.scripts.length; j++) {if (document.scripts[j].src === r) { return; }}*/}
        {/*    k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})*/}
        {/*    (window, document, "script", "https://mc.yandex.ru/metrika/tag.js", "ym");*/}
        {/* */}
        {/*    ym(97806971, "init", {*/}
        {/*      defer: true,*/}
        {/*      clickmap:true,*/}
        {/*      trackLinks:true,*/}
        {/*      accurateTrackBounce:true,*/}
        {/*      webvisor:true*/}
        {/*    });`*/}
        {/*  }*/}
        {/*</Script>*/}
      </body>
    </Html>
  );
}
