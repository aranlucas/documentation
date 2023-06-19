import { allDocs } from "contentlayer/generated"
import { useMDXComponent } from "next-contentlayer/hooks"
import { MDXComponents } from "@/components/mdx/mdx"
import { notFound } from "next/navigation"
import { ScrollArea } from "@/components/ui/scroll-area"
import { DocsSidebarNav } from "@/components/DocsSideBarNav"
import { apiLinks } from "@/components/Menu/MenuLinks"

export const generateStaticParams = async () => {
  return allDocs.map((doc) => ({
    params: { slug: doc.segment },
  }))
}

const getDoc = (params) => {
  // Find the doc for the current page.
  const doc = allDocs.find((doc) => {
    return doc._raw.flattenedPath === params?.slug?.join("/")
  })

  // Return notFound if the doc does not exist.
  if (!doc) {
    return notFound()
  }

  // Return the doc as page props.
  return doc
}

export default function Page({ params }) {
  const doc = getDoc(params)
  // Parse the MDX file via the useMDXComponent hook.
  const MDXContent = useMDXComponent(doc.body.code)

  return (
    <div className="container flex-1 items-start md:grid md:grid-cols-[220px_minmax(0,1fr)] md:gap-8 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-10">
      <aside className="fixed top-14 z-30 -ml-2 hidden h-[calc(100vh-3.5rem)] w-full shrink-0 overflow-y-auto border-r md:sticky md:block">
        <ScrollArea className="py-6 pr-6 lg:py-8">
          <DocsSidebarNav items={apiLinks} />
        </ScrollArea>
      </aside>
      <article className="prose prose-slate dark:prose-invert prose-a:text-pink-500 max-w-none">
        <div className="space-y-0">
          <h1 className="inline-block font-heading text-4xl lg:text-5xl">
            {doc.title}
          </h1>
          {doc.description && (
            <p className="text-xl text-pink-500 flex items-center">
              {doc.description}
            </p>
          )}
        </div>
        <hr className="my-4" />
        <MDXContent components={MDXComponents} />
      </article>
    </div>
  )
}
