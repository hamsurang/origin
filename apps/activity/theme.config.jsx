/** @type {import('nextra-theme-docs').DocsThemeConfig} */
export default {
  logo: <span>함수랑산악회</span>,
  project: {
    link: 'https://github.com/hamsurang/origin',
  },
  chat: {
    link: 'https://discord.gg/gRcpkZHa',
  },
  docsRepositoryBase: 'https://github.com/hamsurang/origin/apps/activity',
  sidebar: {
    toggleButton: true,
  },
  useNextSeoProps() {
    return {
      titleTemplate: '%s – 함수랑산악회',
    }
  },
  head: () => (
    <>
      <meta property="og:description" content="함수랑산악회 활동 페이지" />
    </>
  ),
  footer: {
    text: () => (
      <div style={{ display: 'flex', flexDirection: 'column' }}>
        <span>© 함수랑 산악회</span>
        <a
          style={{ color: '#009972', textDecoration: 'underline' }}
          href="https://open.kakao.com/o/sTjHAUsf"
          target="_blank"
          rel="noreferrer"
        >
          <span>Contact Us</span>
        </a>
      </div>
    ),
  },
}
