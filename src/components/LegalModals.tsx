import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { ScrollArea } from "./ui/scroll-area";
import { useTranslation } from "react-i18next";

type LegalParagraph =
  | { type: "text"; text: string }
  | { type: "labelValue"; label: string; value: string };

type LegalListItem = string | { label: string; description: string };

type LegalSubsection = {
  title: string;
  description: string;
  list?: LegalListItem[];
};

type LegalNote = { label: string; text: string };

type LegalSection = {
  heading: string;
  paragraphs?: LegalParagraph[];
  list?: LegalListItem[];
  subsections?: LegalSubsection[];
  note?: LegalNote;
};

interface LegalContent {
  title: string;
  updated: string;
  sections: LegalSection[];
}

function LegalSections({ content }: { content: LegalContent }) {
  return (
    <div className="space-y-6" style={{ color: "#334155" }}>
      {content.sections.map((section) => (
        <section key={section.heading}>
          <h3
            className="mb-3"
            style={{ color: "#1E293B", fontSize: "1.1rem" }}
          >
            {section.heading}
          </h3>

          {section.paragraphs?.map((paragraph, paragraphIndex) => {
            if (paragraph.type === "labelValue") {
              return (
                <p
                  key={`${section.heading}-paragraph-${paragraphIndex}`}
                  className="mb-2 text-sm leading-relaxed"
                >
                  <strong>{paragraph.label}</strong> {paragraph.value}
                </p>
              );
            }
            return (
              <p
                key={`${section.heading}-paragraph-${paragraphIndex}`}
                className="mb-3 text-sm leading-relaxed"
              >
                {paragraph.text}
              </p>
            );
          })}

          {section.list && (
            <ul className="space-y-2 text-sm leading-relaxed list-disc pl-5">
              {section.list.map((item, itemIndex) => (
                <li key={`${section.heading}-list-${itemIndex}`}>
                  {typeof item === "string" ? (
                    item
                  ) : (
                    <>
                      <strong>{item.label}</strong> {item.description}
                    </>
                  )}
                </li>
              ))}
            </ul>
          )}

          {section.subsections?.map((subsection, subsectionIndex) => (
            <div key={`${section.heading}-subsection-${subsectionIndex}`} className="mb-4">
              <h4
                className="mb-2"
                style={{ color: "#5B8DEF", fontSize: "0.95rem" }}
              >
                {subsection.title}
              </h4>
              <p className="text-sm leading-relaxed">{subsection.description}</p>
              {subsection.list && (
                <ul
                  className="mt-2 space-y-1 text-sm list-disc pl-5"
                  style={{ color: "#64748B" }}
                >
                  {subsection.list.map((item, itemIndex) => (
                    <li key={`${section.heading}-subsection-${subsectionIndex}-item-${itemIndex}`}>
                      {typeof item === "string" ? (
                        item
                      ) : (
                        <>
                          <strong>{item.label}</strong> {item.description}
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}

          {section.note && (
            <p className="mt-3 text-sm leading-relaxed" style={{ color: "#64748B" }}>
              <strong>{section.note.label}</strong> {section.note.text}
            </p>
          )}
        </section>
      ))}

      <section className="pt-4 border-t" style={{ borderColor: "rgba(91, 141, 239, 0.1)" }}>
        <p className="text-xs" style={{ color: "#94A3B8" }}>
          {content.updated}
        </p>
      </section>
    </div>
  );
}

interface LegalModalProps {
  trigger: React.ReactNode;
  title: string;
  children: React.ReactNode;
}

function LegalModal({ trigger, title, children }: LegalModalProps) {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger}
      </DialogTrigger>
      <DialogContent 
        className="max-w-3xl max-h-[85vh] p-0 gap-0 rounded-2xl border-0"
        style={{
          backgroundColor: '#FFFFFF',
          boxShadow: '0 20px 60px rgba(91, 141, 239, 0.25)'
        }}
        aria-describedby={undefined}
      >
        <DialogHeader className="px-6 pt-6 pb-4 border-b" style={{ borderColor: 'rgba(91, 141, 239, 0.1)' }}>
          <DialogTitle style={{ color: '#1E293B', fontSize: '1.5rem' }}>
            {title}
          </DialogTitle>
        </DialogHeader>
        <ScrollArea className="h-[calc(85vh-100px)] px-6 py-4">
          <div className="pr-4">
            {children}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}

export function TermsModal({ trigger }: { trigger: React.ReactNode }) {
  const { t } = useTranslation();
  const content = t("legal.terms", { returnObjects: true }) as LegalContent;

  return (
    <LegalModal trigger={trigger} title={content.title}>
      <LegalSections content={content} />
    </LegalModal>
  );
}

export function PrivacyModal({ trigger }: { trigger: React.ReactNode }) {
  const { t } = useTranslation();
  const content = t("legal.privacy", { returnObjects: true }) as LegalContent;

  return (
    <LegalModal trigger={trigger} title={content.title}>
      <LegalSections content={content} />
    </LegalModal>
  );
}

export function CookiesModal({ trigger }: { trigger: React.ReactNode }) {
  const { t } = useTranslation();
  const content = t("legal.cookies", { returnObjects: true }) as LegalContent;

  return (
    <LegalModal trigger={trigger} title={content.title}>
      <LegalSections content={content} />
    </LegalModal>
  );
}
