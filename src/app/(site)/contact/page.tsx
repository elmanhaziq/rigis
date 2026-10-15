import type { Metadata } from "next";
import { Building2, Handshake, Mail, Phone, Search } from "lucide-react";
import { getPublicDataset } from "@/lib/data";
import { SectionHeading } from "@/components/ui/section-heading";
import { ContactForm } from "@/components/forms/contact-form";

export const metadata: Metadata = {
  title: "Contact",
  description: "Contact RIGIS about research collaboration, research enquiries and postgraduate opportunities.",
  alternates: { canonical: "/contact/" },
};

export default async function ContactPage() {
  const { site } = await getPublicDataset();
  const notSet = <span className="text-muted-foreground italic">To be confirmed</span>;

  return (
    <>
      <header className="border-b border-border">
        <div className="container-page py-16 sm:py-20">
          <SectionHeading
            as="h1"
            eyebrow="Contact"
            title="Get in touch with RIGIS"
            description="For research collaboration, research enquiries or postgraduate opportunities, send us a message and the right member of the group will respond."
            align="split"
          />
        </div>
      </header>

      <div className="container-page grid gap-14 py-14 lg:grid-cols-12 lg:py-20">
        <aside className="space-y-10 lg:col-span-4" aria-label="Contact information">
          <section aria-labelledby="group-contact">
            <h2 id="group-contact" className="eyebrow">Research group contact</h2>
            <ul className="mt-4 space-y-4 text-[0.9375rem]">
              <li className="flex gap-3">
                <Mail className="mt-0.5 size-4 shrink-0 text-navy-800" aria-hidden="true" />
                {site.contactEmail ? (
                  <a href={`mailto:${site.contactEmail}`} className="break-all text-navy-800 hover:underline">{site.contactEmail}</a>
                ) : notSet}
              </li>
              <li className="flex gap-3">
                <Phone className="mt-0.5 size-4 shrink-0 text-navy-800" aria-hidden="true" />
                {site.contactPhone ? (
                  <a href={`tel:${site.contactPhone.replace(/\s/g, "")}`} className="text-navy-800 hover:underline">{site.contactPhone}</a>
                ) : notSet}
              </li>
            </ul>
          </section>

          <section aria-labelledby="address">
            <h2 id="address" className="eyebrow">Institutional address</h2>
            <div className="mt-4 flex gap-3 text-[0.9375rem]">
              <Building2 className="mt-0.5 size-4 shrink-0 text-navy-800" aria-hidden="true" />
              <div>
                <p className="font-medium text-navy-900">{site.affiliation}</p>
                <p className="mt-1 text-muted-foreground">{site.address ?? notSet}</p>
              </div>
            </div>
          </section>

          <section aria-labelledby="enquiry-types" className="border-t border-border pt-8">
            <h2 id="enquiry-types" className="eyebrow">How we can help</h2>
            <ul className="mt-5 space-y-6">
              <li className="flex gap-4">
                <Handshake className="mt-0.5 size-5 shrink-0 text-navy-800" aria-hidden="true" />
                <div>
                  <h3 className="font-heading font-bold">Collaboration enquiries</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Joint research, grant partnerships, visiting researchers and industry projects.
                  </p>
                </div>
              </li>
              <li className="flex gap-4">
                <Search className="mt-0.5 size-5 shrink-0 text-navy-800" aria-hidden="true" />
                <div>
                  <h3 className="font-heading font-bold">Research enquiries</h3>
                  <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
                    Questions about our projects, publications, datasets or postgraduate supervision.
                  </p>
                </div>
              </li>
            </ul>
            <p className="mt-8 text-[0.8125rem] leading-relaxed text-muted-foreground">
              Individual members&rsquo; email addresses are only shown where they have chosen to make
              them public on their profile.
            </p>
          </section>
        </aside>

        <section aria-labelledby="form-title" className="border border-border bg-card p-6 sm:p-10 lg:col-span-8">
          <h2 id="form-title" className="font-heading text-2xl font-bold">Send a message</h2>
          <div className="mt-6">
            <ContactForm />
          </div>
        </section>
      </div>
    </>
  );
}
