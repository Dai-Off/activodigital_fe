// src/i18n.ts
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

/**
 * Nota:
 * - Mantengo los mismos árboles de claves que ya usa tu app (en/es/de).
 * - He eliminado duplicados y mezclas de idiomas que había en "de".
 * - Si falta alguna traducción en "de", caerá a "en" gracias a fallbackLng.
 */

export const resources = {
  de: {
    translation: {
      footer: {
        help: 'Benötigen Sie Hilfe mit einem Asset oder Dokument?',
        assistant: 'KI-Assistent',
        product: 'Produkt',
        assets: 'Vermögenswerte',
        documentation: 'Dokumentation',
        maintenance: 'Wartung',
        compliance: 'Compliance',
        resources: 'Ressourcen',
        helpCenter: 'Hilfezentrum',
        blog: 'Blog',
        changelog: 'Changelog',
        company: 'Unternehmen',
        aboutUs: 'Über uns',
        contact: 'Kontakt',
        careers: 'Karriere',
        legal: 'Rechtliches',
        terms: 'Bedingungen',
        privacy: 'Datenschutz',
        cookies: 'Cookies',
        supportEmail: 'support@yourdomain.com',
        supportPhone: '+351 210 000 000',
        productName: 'Digitales Asset',
        copyright: '©',
        operational: 'Betriebsbereit',
        up: 'Oben',
      },
      dashboard: {
        completed: 'Abgeschlossen',
        inProgress: 'In Bearbeitung',
        scheduled: 'Geplant',
        expired: 'Abgelaufen',
        financingAccess: 'Zugang zu Finanzierung',
        high: 'Hoch',
        complianceByType: 'Einhaltung nach Typ',
        tertiary: 'Tertiär',
        digitalBuildingBook: 'Digitales Gebäudebuch',
        published: 'Veröffentlicht',
        version: 'Version',
        updated: 'Aktualisiert',
        statusBySection: 'Status nach Abschnitt',
        ok: 'OK',
        pending: 'Ausstehend',
        installations: 'Installationen',
        certificates: 'Zertifikate',
        maintenance: 'Wartung',
        inspections: 'Inspektionen',
        accessAllDocs:
          'Zugriff auf alle technischen Dokumentationen, Zertifikate und Bauvorschriften',
        openDigitalBook: 'Digitales Buch öffnen',
        legalCompliance: 'Rechtliche Einhaltung',
        upcomingExpirations: 'Kommende Abläufe',
        maintenanceTasks: 'Wartungsaufgaben',
        openIncidents: 'Offene Vorfälle',
        maintenancePlan: 'Wartungsplan',
        recentActivity: 'Letzte Aktivität',
        ceeRenewed: 'CEE-Zertifikat erneuert',
        daysAgo: 'Vor {{count}} Tag',
        daysAgo_other: 'Vor {{count}} Tagen',
        weekAgo: 'Vor 1 Woche',
        weeksAgo: 'Vor {{count}} Wochen',
        hvacCompleted: 'HVAC-Wartung abgeschlossen',
        elevatorScheduled: 'Aufzugsinspektion geplant',
        inDays: 'In {{count}} Tag',
        inDays_other: 'In {{count}} Tagen',
        pciIncident: 'PCI-Systemvorfall',
        buildingLocation: 'Standort des Gebäudes',
        municipality: 'Gemeinde',
        province: 'Provinz',
        coordinates: 'Koordinaten',
        postalCode: 'Postleitzahl',
        propertyValuation: 'Immobilienbewertung',
        totalEstimatedValue: 'Geschätzter Gesamtwert',
        lastUpdated: 'Aktualisiert',
        valuePerSqm: 'Wert pro m²',
        valuePerUnit: 'Wert pro Einheit',
        annualChange: 'Jährliche Änderung',
        lastAppraisal: 'Letzte Bewertung',
      },
      of: 'von',
      averageEnergyClass: 'Durchschnittliche Energieklasse:',
      averageESGScore: 'Durchschnittlicher ESG-Score:',
      completedDigitalBook: 'Abgeschlossenes Digitalbuch:',
      greenFinancingEligible: '% Portfolio für grüne Finanzierung geeignet',
      completedDigitalBooksPercent: '% digitale Bücher abgeschlossen',
      propietario: 'Eigentümer',
      tecnico: 'Techniker',
      administrador: 'Administrator',
      welcome: 'Willkommen',
      success: 'Erfolg',

      myAssets: 'Meine Vermögenswerte',
      assignedAssets: 'Zugewiesene Vermögenswerte',
      managePortfolio:
        'Verwalten Sie Ihr Immobilienportfolio und weisen Sie Technikern Aufgaben zu',
      assignedAssetsDesc:
        'Ihnen zugewiesene Vermögenswerte zur Verwaltung digitaler Bücher',
      createBuilding: 'Gebäude erstellen',
      assetsList: 'Vermögensliste',
      name: 'Name',
      value: 'Wert',
      digitalBookStatus: 'STATUS DIGITALES BUCH',
      cee: 'CEE',
      esg: 'ESG',
      squareMeters: 'm²',
      noAssetsYet: 'Sie haben noch keine Vermögenswerte',
      noAssignedAssets: 'Sie haben keine zugewiesenen Vermögenswerte',
      createFirstAsset:
        'Beginnen Sie mit der Erstellung Ihres ersten Vermögenswerts, um Ihr Portfolio zu verwalten.',
      contactAdmin:
        'Kontaktieren Sie Ihren Administrator, um Ihnen Vermögenswerte zuzuweisen.',
      createFirstAssetBtn: 'Ersten Vermögenswert erstellen',
      showing: 'Anzeigen',
      pageSize: 'Seitengröße',
      perPage: '/Seite',
      firstPage: 'Erste Seite',
      previous: 'Vorherige',
      page: 'Seite',
      next: 'Nächste',
      lastPage: 'Letzte Seite',
      completed: 'Abgeschlossen',
      pending: 'Ausstehend',
      ready: 'Bereit',
      inProgress: 'In Bearbeitung',

      // Vistas varias (resumen de claves usadas en tu app)
      documentManagement: 'Dokumentenmanagement',
      documentDesc: 'Hier können Sie Gebäudedokumente anzeigen und verwalten.',
      goToHome: 'Zur Startseite',
      digitalBookTitle: 'Digitales Gebäudebuch',
      generalInfo: 'ALLGEMEINE INFORMATIONEN',
      technicalManager: 'Technischer Leiter',
      referenceRegulations: 'Referenzvorschriften',
      digitalBookSections: 'Abschnitte des digitalen Buchs',
      publicationStatus: 'Veröffentlichungsstatus',
      digitalSignatures: 'Digitale Signaturen',
      attachedDocuments: 'Beigefügte Dokumente',
      systemReferences: 'Systemreferenzen',
      bookId: 'Buch-ID',
      buildingId: 'Gebäude-ID',
      creationDate: 'Erstellungsdatum',
      responsible: 'Verantwortlich',
      userId: 'Benutzer-ID',
      status: 'Status',
      accessLevel: 'Zugriffsebene',
      validFrom: 'Gültig von',
      validUntil: 'Gültig bis',
      viewPublicVersion: 'Öffentliche Version anzeigen',
      activeAlerts: 'Aktive Benachrichtigungen',
      noActiveAlerts: 'Keine aktiven Benachrichtigungen',
      signingUser: 'Signaturbenutzer',
      signed: 'Unterzeichnet',
      view: 'Ansehen',
      interventions: 'Eingriffe',
      installations: 'Installationen',
      systemDocuments: 'Systemdokumente',
      actions: 'Aktionen',
      downloadPDF: 'PDF herunterladen',
      exportData: 'Daten exportieren',
      versionHistory: 'Versionsverlauf',
      backToBuilding: 'Zurück zum Gebäude',

      // UI comunes
      loading: 'Wird geladen…',
      uploadFiles: 'Dateien hochladen',
      dragOrClick: 'Ziehen oder klicken zum Hochladen',

      error: 'Fehler',
      warning: 'Warnung',
      info: 'Info',
      unknownError: 'Unbekannter Fehler',

      errorBoundary: {
        title: 'Etwas ist schiefgelaufen',
        message:
          'Ein unerwarteter Fehler ist aufgetreten. Bitte laden Sie die Seite neu oder versuchen Sie es erneut.',
        technicalDetails: 'Technische Details',
        reloadPage: 'Seite neu laden',
        retry: 'Erneut versuchen',
      },
      protectedRoute: {
        verifyingAuth: 'Authentifizierung überprüfen…',
        accessRestricted: 'Zugang beschränkt',
        noPermission:
          'Sie haben keine Berechtigung, auf diesen Bereich zuzugreifen.',
        goBack: 'Zurück',
      },
      cfoDashboard: {
        title: 'CFO-Dashboard',
        welcomeCFO: 'Willkommen',
        cfo: 'CFO',
        inDevelopment: 'CFO-Dashboard in Entwicklung',
        description:
          'Dieser Bereich wird derzeit entwickelt. Bald haben Sie Zugriff auf die spezifischen Funktionen für Ihre CFO-Rolle.',
      },
      complianceView: {
        newCertificate: 'Neues Zertifikat',
        timeline: 'Ablaufplan',
        due: 'Fälligkeit',
        ceeCertificate: 'CEE-Zertifikat',
        riteInspection: 'RITE-Revision',
        btIndustry: 'Niederspannungsindustrie',
        elevator: 'Aufzug',
        pci: 'PCI',
        accessibility: 'Barrierefreiheit',
        status: 'Status',
        valid: 'Gültig',
        expiryApproaching: 'Läuft bald ab',
        expired: 'Abgelaufen',
        underReview: 'In Prüfung',
        expiryDate: 'Ablaufdatum',
        rating: 'Bewertung',
        type: 'Typ',
        installer: 'Installateur',
        maintainer: 'Wartungsfirma',
        evaluation: 'Bewertung',
        regulation: 'Vorschrift',
        quinquennialInspection: 'Fünfjährige Inspektion',
        semiannualInspection: 'Halbjährliche Revision',
        pending: 'Ausstehend',
        viewCertificate: 'Zertifikat ansehen',
        scheduleInspection: 'Inspektion planen',
        viewBulletin: 'Bulletin ansehen',
        actionRequired: 'Maßnahme erforderlich',
        completeEvaluation: 'Bewertung abschließen',
        elevatorUrgent: 'Aufzugsrevision – DRINGEND',
        riteInspectionItem: 'RITE-Inspektion',
        pciReview: 'PCI-Revision',
        ceeRenewal: 'CEE-Erneuerung',
        threeDays: '3 Tage',
        oneMonth: '1 Monat',
        sevenMonths: '7 Monate',
        tenYears: '10 Jahre',
      },
      buildings: {
        createBuilding: 'Gebäude erstellen – Allgemeine Daten',
        completeBasicInfo:
          'Vervollständigen Sie die grundlegenden Gebäudeinformationen.',
        buildingName: 'Gebäudename',
        buildingNamePlaceholder:
          'z. B.: Zentralturm, Wohnanlage Los Olivos…',
        constructionYear: 'Baujahr',
        typology: 'Typologie',
        selectTypology: 'Wählen Sie eine Typologie',
        residential: 'Wohngebiet',
        mixed: 'Gemischt',
        commercial: 'Gewerbe',
        numFloors: 'Anzahl der Etagen',
        numUnits: 'Anzahl der Einheiten',
        assetPrice: 'Preis des Vermögenswerts (€)',
        assetPriceHelper: 'Optional. Geschätzter Wert des Vermögenswerts',
        technicianEmail: 'E-Mail des zugewiesenen Technikers',
        technicianEmailHelper:
          'Optional. Der Techniker kann digitale Bücher verwalten',
        cfoEmail: 'E-Mail des zugewiesenen CFO',
        cfoEmailHelper:
          'Optional. Der CFO hat Zugriff auf Finanzinformationen',
        financialInfo: 'Finanzinformationen',
        financialInfoDesc:
          'Optionale Felder, die später ausgefüllt werden können.',
        rehabilitationCost: 'Sanierungskosten (€)',
        rehabilitationCostHelper:
          'Optional. Geschätzte Kosten zur Sanierung',
        potentialValue: 'Potentieller Wert (€)',
        potentialValueHelper:
          'Optional. Geschätzter Wert nach Sanierung',
        surface: 'Fläche (m²)',
        surfaceHelper: 'Optional. Gesamtfläche des Gebäudes',
        saveDraft: 'Entwurf speichern',
        validating: 'Validierung…',
        next: 'Weiter',
        draftSaved: 'Entwurf gespeichert',
        dataSavedTemporarily: 'Die Daten wurden vorübergehend gespeichert',
        locationAndPhotos: 'Standort und Fotos',
        locationAndPhotosDesc: 'Fügen Sie den Standort und Fotos hinzu',
        searchLocationPlaceholder: 'Adresse suchen…',
        searching: 'Suche…',
        search: 'Suchen',
        clickOnMap: 'Klicken Sie auf die Karte, um den Standort zu wählen',
        addPhotos: 'Fotos hinzufügen',
        addPhotosDesc: 'Bis zu 5 Fotos hochladen',
        mainPhoto: 'Hauptfoto',
        remove: 'Entfernen',
        setAsMain: 'Als Hauptfoto festlegen',
        locationRequired:
          'Sie müssen einen Standort auf der Karte auswählen',
        locationAndPhotosSaved:
          'Standort und Fotos vorübergehend gespeichert',
        previous: 'Zurück',
        assetSummary: 'Vermögenswertübersicht',
        reviewBeforeCreating:
          'Prüfen Sie alle Informationen, bevor Sie den Vermögenswert erstellen.',
        mainPhotoOf: 'Hauptfoto von',
        noMainPhoto: 'Kein Hauptbild',
        generalInfo: 'Allgemeine Informationen',
        editData: 'Daten bearbeiten',
        editLocation: 'Standort bearbeiten',
        creating: 'Erstellen…',
        createAsset: 'Vermögenswert erstellen',
        buildingCreatedSuccess: 'Gebäude erfolgreich erstellt',
        errorCreatingAsset: 'Fehler beim Erstellen des Vermögenswerts',
        roleConflict: 'Benutzerrollenkonflikt',
        needHelp: 'Benötigen Sie Hilfe? Sehen Sie sich unseren',
        buildingCreationGuide: 'Leitfaden zur Gebäudeerstellung',
        or: 'oder',
        contactSupport: 'kontaktieren Sie den Support',
        noLocationFound: 'Kein Standort gefunden.',
        errorSearchingLocation:
          'Fehler bei der Standortsuche.',
        addressRequired:
          'Adresse ist erforderlich. Bitte wählen Sie einen Standort auf der Karte.',
        validUnits:
          'Geben Sie eine gültige Anzahl von Einheiten ein (1–1000)',
        validPrice: 'Geben Sie einen gültigen Preis ein',
        validEmail: 'Geben Sie eine gültige E-Mail ein',
        validCost: 'Geben Sie gültige Kosten ein',
        validValue: 'Geben Sie einen gültigen Wert ein',
        validSurface: 'Geben Sie eine gültige Fläche ein',
        draftNameRequired:
          'Name ist erforderlich, um den Entwurf zu speichern',
        missingFormData:
          'Formulardaten fehlen. Bitte vervollständigen Sie alle Schritte.',
        newBuilding: 'Neues Gebäude',
        notSpecified: 'Nicht angegeben',
        unassigned: 'Nicht zugewiesen',
        assignedTechnician: 'Zugewiesener Techniker',
        assignedCFO: 'Zugewiesener CFO',
        rehabilitationCostLabel: 'Sanierungskosten',
        potentialValueLabel: 'Potentieller Wert',
        surfaceLabel: 'Fläche',
        address: 'Adresse',
        location: 'Standort',
        editDataButton: 'Daten bearbeiten',
        editLocationButton: 'Standort bearbeiten',
        floors: 'Etagen',
        units: 'Einheiten',
        price: 'Preis',
        markLocationAndUpload:
          'Markieren Sie den Standort des Gebäudes auf der Karte und laden Sie die Fotos hoch.',
        buildingLocation: 'Standort des Gebäudes',
        searchOrClickMap:
          'Suchen Sie per Adresseingabe oder klicken Sie auf die Karte.',
        addressPlaceholder: 'Bsp.: Calle Mayor 123, Madrid',
        noResults: 'Keine Ergebnisse gefunden',
        selectedLocation: 'Ausgewählter Standort',
        latitude: 'Breitengrad',
        longitude: 'Längengrad',
        buildingPhotos: 'Fotos des Gebäudes',
        uploadPhotosDesc:
          'Laden Sie Fotos des Gebäudes hoch. Das erste ist das Hauptfoto.',
        uploadPhotos: 'Fotos hochladen',
        dragPhotosOrClick:
          'Ziehen Sie Fotos hierher oder klicken Sie, um auszuwählen ({{remaining}} verbleibend)',
        uploadedPhotos: 'Hochgeladene Fotos',
        maxPhotos: 'Maximal 5 Fotos',
        saveAndContinue: 'Speichern und fortfahren',
      },
    },
  },
  en: {
    translation: {
      // (sin cambios relevantes, contenido tal como lo compartiste)
      // ...
      // Para ahorrar espacio, dejo tu bloque "en" tal cual.
      // Copia el bloque completo que ya tenías aquí.
    },
  },
  es: {
    translation: {
      // (sin cambios relevantes, contenido tal como lo compartiste)
      // ...
      // Copia el bloque completo que ya tenías aquí.
    },
  },
} as const;

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    supportedLngs: ['en', 'es', 'de'],
    // Si usas namespaces adicionales, decláralos aquí.
    defaultNS: 'translation',
    ns: ['translation'],
    interpolation: { escapeValue: false },
    returnNull: false, // evita devolver null si falta una clave (útil con defaultValue)
    detection: {
      // Orden sensata para web apps
      order: ['localStorage', 'querystring', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
    react: {
      useSuspense: false, // evita suspense boundaries si prefieres loaders propios
    },
  });

export default i18n;
