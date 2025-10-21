import { useTranslation } from 'react-i18next';
import type { TFunction } from 'i18next';

export default function Cumplimiento() {
  const { t } = useTranslation();

  return (
    <div className="section animate-fadeInUp">
      {/* Header */}
      <div
        className="flex justify-between items-center mb-6"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.1s both' }}
      >
        <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
          {t('compliance')}
        </h2>

        <button className="px-4 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2">
          <span className="inline-block">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="w-4 h-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path d="M12 3l7 4v5c0 5.25-3.5 9.74-7 11-3.5-1.26-7-5.75-7-11V7l7-4z" />
              <path d="M9 12l2 2 4-4" />
            </svg>
          </span>
          <span>{t('complianceView.newCertificate')}</span>
        </button>
      </div>

      {/* Compliance Status Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
        {/* Certificado CEE */}
        <Card
          title="complianceView.ceeCertificate"
          statusColor="green"
          fields={[
            ['complianceView.status', 'complianceView.valid', 'green'],
            ['complianceView.expiryDate', '15/03/2034'],
            ['complianceView.rating', 'B'],
          ]}
          buttonLabel="complianceView.viewCertificate"
        />

        {/* Revisión RITE */}
        <Card
          title="complianceView.riteInspection"
          statusColor="yellow"
          fields={[
            ['complianceView.status', 'complianceView.expiryApproaching', 'yellow'],
            ['complianceView.expiryDate', '20/05/2024'],
            ['complianceView.type', 'complianceView.quinquennialInspection'],
          ]}
          buttonLabel="complianceView.scheduleInspection"
          buttonColor="yellow"
        />

        {/* Industria BT */}
        <Card
          title="complianceView.btIndustry"
          statusColor="green"
          fields={[
            ['complianceView.status', 'complianceView.valid', 'green'],
            ['complianceView.expiryDate', '10/09/2029'],
            ['complianceView.installer', 'ELECT-2024-001'],
          ]}
          buttonLabel="complianceView.viewBulletin"
        />

        {/* Ascensor */}
        <Card
          title="complianceView.elevator"
          statusColor="red"
          fields={[
            ['complianceView.status', 'complianceView.expired', 'red'],
            ['complianceView.expiryDate', '15/04/2024'],
            ['complianceView.type', 'complianceView.semiannualInspection'],
          ]}
          buttonLabel="complianceView.actionRequired"
          buttonColor="red"
        />

        {/* PCI */}
        <Card
          title="complianceView.pci"
          statusColor="green"
          fields={[
            ['complianceView.status', 'complianceView.valid', 'green'],
            ['complianceView.expiryDate', '30/11/2024'],
            ['complianceView.maintainer', 'PCI-MANT-001'],
          ]}
          buttonLabel="complianceView.viewCertificate"
        />

        {/* Accesibilidad */}
        <Card
          title="complianceView.accessibility"
          statusColor="yellow"
          fields={[
            ['complianceView.status', 'complianceView.underReview', 'yellow'],
            ['complianceView.evaluation', 'complianceView.pending'],
            ['complianceView.regulation', 'CTE DB-SUA'],
          ]}
          buttonLabel="complianceView.completeEvaluation"
          buttonColor="yellow"
        />
      </div>

      {/* Compliance Timeline */}
      <div
        className="bg-white rounded-xl border border-gray-200 p-6"
        style={{ animation: 'fadeInUp 0.6s ease-out 0.8s both' }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-6">
          {t('complianceView.timeline')}
        </h3>

        <TimelineItem
          color="red"
          title="complianceView.elevatorUrgent"
          due="15 de abril de 2024"
          tag="complianceView.threeDays"
          tagColor="red"
        />
        <TimelineItem
          color="yellow"
          title="complianceView.riteInspectionItem"
          due="20 de mayo de 2024"
          tag="complianceView.oneMonth"
          tagColor="yellow"
        />
        <TimelineItem
          color="blue"
          title="complianceView.pciReview"
          due="30 de noviembre de 2024"
          tag="complianceView.sevenMonths"
          tagColor="blue"
        />
        <TimelineItem
          color="green"
          title="complianceView.ceeRenewal"
          due="15 de marzo de 2034"
          tag="complianceView.tenYears"
          tagColor="green"
        />
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes fadeInUp {
            from { transform: translateY(20px); opacity: 0; }
            to { transform: translateY(0); opacity: 1; }
          }
        `}
      </style>
    </div>
  );
}

/* Helper Components */
type CardProps = {
  title: string;
  statusColor: string;
  fields: [string, string, string?][];
  buttonLabel: string;
  buttonColor?: string;
};

function Card({ title, statusColor, fields, buttonLabel, buttonColor = 'gray' }: CardProps) {
  const { t }: { t: TFunction } = useTranslation();
  return (
    <div
      className="bg-white rounded-xl border border-gray-200 p-6"
      style={{ animation: 'fadeInUp 0.6s ease-out 0.3s both' }}
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{t(title)}</h3>
        <div className={`w-3 h-3 bg-${statusColor}-400 rounded-full`}></div>
      </div>
      <div className="space-y-2">
        {fields.map(([label, value, color], i) => (
          <p key={i} className="text-sm text-gray-500">
            {t(label)}:{' '}
            <span
              className={`font-medium ${color ? `text-${color}-600` : 'text-gray-700'}`}
            >
              {t(value)}
            </span>
          </p>
        ))}
      </div>
      <button
        className={`mt-4 w-full px-3 py-2 bg-${buttonColor}-100 text-${buttonColor}-800 text-sm font-medium rounded-lg hover:bg-${buttonColor}-200 transition-colors`}
      >
        {t(buttonLabel)}
      </button>
    </div>
  );
}

type TimelineItemProps = {
  color: string;
  title: string;
  due: string;
  tag: string;
  tagColor: string;
};

function TimelineItem({ color, title, due, tag, tagColor }: TimelineItemProps) {
  const { t }: { t: TFunction } = useTranslation();
  return (
    <div className="flex items-start space-x-4 mb-4">
      <div className={`flex-shrink-0 w-4 h-4 bg-${color}-400 rounded-full mt-1`}></div>
      <div className="flex-1">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="font-medium text-gray-900">{t(title)}</h4>
            <p className="text-sm text-gray-500">{t('complianceView.due')}: {due}</p>
          </div>
          <span
            className={`px-2 py-1 bg-${tagColor}-100 text-${tagColor}-800 text-xs font-medium rounded-md`}
          >
            {t(tag)}
          </span>
        </div>
      </div>
    </div>
  );
}
