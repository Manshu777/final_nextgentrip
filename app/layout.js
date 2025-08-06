import { Inter } from "next/font/google";
import "./globals.css";
import Navbar from "./Component/AllComponent/Navbar";
import Footer from "./Component/Footer";
import Topbar from "./Component/Topbar";
import Providerfile from "./Component/Store/Providerfile";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import { development } from "./Component/common";
import Maintenance from "./Component/AllComponent/Maintenance";
import { Montserrat } from "next/font/google";
import LayoutCompo from "./LayoutCompo";

const inter = Inter({ subsets: ["latin"] });

export default async function RootLayout({ children }) {
  const locale = await getLocale();
  const messages = await getMessages();

  return (
    <html lang={locale}>
      <head>
        {/* FontAwesome */}
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"
        />

        {/* Google Analytics */}
        <script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-7F46NND7PG"
        ></script>

        {/* Canonical URL */}
        <link rel="canonical" href="https://www.nextgentrip.com" />

        {/* ✅ JSON-LD Schema Markup */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify([
              {
                "@context": "https://schema.org",
                "@type": "Organization",
                name: "Next Gen Trip Pvt. Ltd.",
                url: "https://www.nextgentrip.com",
                logo: "https://www.nextgentrip.com/logo.png",
                foundingDate: "2023",
                sameAs: [
                  "https://www.facebook.com/profile.php?id=61573763406606",
                  "https://www.instagram.com/nextgentrip/",
                  "https://x.com/NextGenTrip",
                ],
                contactPoint: {
                  "@type": "ContactPoint",
                  telephone: "+91 98775 79319",
                  contactType: "Customer Support",
                  areaServed: "IN",
                  availableLanguage: ["English", "Hindi"],
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "WebSite",
                name: "NextGenTrip",
                url: "https://www.nextgentrip.com",
                potentialAction: {
                  "@type": "SearchAction",
                  target:
                    "https://www.nextgentrip.com/search?q={search_term_string}",
                  "query-input": "required name=search_term_string",
                },
              },
              {
                "@context": "https://schema.org",
                "@type": "LocalBusiness",
                name: "Next Gen Trip Pvt. Ltd.",
                image: "https://www.nextgentrip.com/logo.png",
                address: {
                  "@type": "PostalAddress",
                  streetAddress: "SCO 371, 372, 373 Sector 34-A",
                  addressLocality: "Chandigarh",
                  addressRegion: "Chandigarh",
                  postalCode: "160022",
                  addressCountry: "IN",
                },
                telephone: "+91 98775 79319",
                url: "https://www.nextgentrip.com",
                priceRange: "₹₹",
                openingHours: "Mo-Sa 10:00-18:00",
                sameAs: [
                  "https://www.facebook.com/profile.php?id=61573763406606",
                  "https://www.instagram.com/nextgentrip/",
                  "https://x.com/NextGenTrip",
                ],
              },
              {
                "@context": "https://schema.org",
                "@type": "Service",
                serviceType: "Online Travel Agency",
                provider: {
                  "@type": "Organization",
                  name: "Next Gen Trip Pvt. Ltd.",
                  url: "https://www.nextgentrip.com",
                },
                areaServed: {
                  "@type": "Place",
                  name: "Worldwide",
                },
                availableChannel: {
                  "@type": "ServiceChannel",
                  serviceUrl: "https://www.nextgentrip.com",
                },
                description:
                  "Book flights, hotels, holiday packages, visas, buses, cabs, cruises, and eSIM globally with NextGenTrip – your trusted IATA-certified travel partner.",
              },
            ]),
          }}
        />

        {/* Google Analytics Config */}
        <script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-7F46NND7PG');
            `,
          }}
        />

        {/* Hotjar Tracking */}
        <script
          id="hotjar-tracking"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(h,o,t,j,a,r){
                  h.hj=h.hj||function(){(h.hj.q=h.hj.q||[]).push(arguments)};
                  h._hjSettings={hjid:5345864,hjsv:6};
                  a=o.getElementsByTagName('head')[0];
                  r=o.createElement('script');r.async=1;
                  r.src=t+h._hjSettings.hjid+j+h._hjSettings.hjsv;
                  a.appendChild(r);
              })(window,document,'https://static.hotjar.com/c/hotjar-','.js?sv=');
            `,
          }}
        />

        {/* Google Tag Manager */}
        <script
          id="google-tag-manager"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
              })(window,document,'script','dataLayer','GTM-P6DBCLHP');
            `,
          }}
        />

        {/* Facebook Pixel */}
        <script
          id="facebook-pixel"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              !function(f,b,e,v,n,t,s)
              {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
              n.callMethod.apply(n,arguments):n.queue.push(arguments)};
              if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
              n.queue=[];t=b.createElement(e);t.async=!0;
              t.src=v;s=b.getElementsByTagName(e)[0];
              s.parentNode.insertBefore(t,s)}(window, document,'script',
              'https://connect.facebook.net/en_US/fbevents.js');
              fbq('init', '905109698255955');
              fbq('track', 'PageView');
            `,
          }}
        />
      </head>

      <body>
        <noscript>
          <iframe
            src="https://www.googletagmanager.com/ns.html?id=GTM-P6DBCLHP"
            height="0"
            width="0"
            style={{ display: "none", visibility: "hidden" }}
          ></iframe>
        </noscript>

        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=905109698255955&ev=PageView&noscript=1"
          />
        </noscript>
       
          {development !== "production" ? (
            <NextIntlClientProvider messages={messages}>
              <Providerfile>
                <LayoutCompo>{children}</LayoutCompo>
              </Providerfile>
            </NextIntlClientProvider>
          ) : (
            <Maintenance />
          )}
       
      </body>
    </html>
  );
}
