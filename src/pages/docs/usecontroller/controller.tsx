import Seo from "../../../components/seo"
import Layout from "../../../components/layout"
import Footer from "../../../components/Footer"
import StarRepo from "../../../components/StarRepo"
import containerStyles from "../../../styles/container.module.css"
import typographyStyles from "../../../styles/typography.module.css"
import ControllerContent from "../../../content/controller.mdx"
import { Menu, apiLinks } from "../../../components/Menu"

export default function ControllerPage() {
  return (
    <Layout>
      <Seo title="Controller" />
      <div className={containerStyles.container}>
        <h1 className={typographyStyles.headingWithTopMargin} id="main">
          Controller
        </h1>
        <p className={typographyStyles.subHeading}>
          Wrapper component for controlled inputs
        </p>

        <div className={containerStyles.wrapper}>
          <Menu pages={apiLinks} />

          <main>
            <ControllerContent />
            <StarRepo />

            <Footer />
          </main>
        </div>
      </div>
    </Layout>
  )
}
