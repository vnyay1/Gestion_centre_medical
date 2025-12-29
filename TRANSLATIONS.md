# Translation System – Medical Center

## Overview

The Medical Center management system now supports multi-language translations in:
- **French** (Français) - Default language
- **English** (English)
- **Arabic** (العربية)

## How It Works

### Translation Service (`assets/js/translations.js`)

The translation system consists of:

1. **Translations Object**: Contains all text strings in three languages (French, English, Arabic)
2. **TranslationService Class**: Manages language switching and updates
3. **Data Attributes**: HTML elements use `data-i18n` attributes to reference translation keys

### Key Features

- **Automatic Language Detection**: Remembers user's language choice in localStorage
- **RTL Support**: Automatically applies right-to-left (RTL) layout for Arabic
- **Dynamic Updates**: Changes page content instantly when language is switched
- **Placeholder Support**: Updates input field placeholders
- **Title Support**: Updates element titles/tooltips

## Using the Translation System

### 1. Language Selector (Login Page)

```html
<select id="langSelect" class="form-select">
    <option value="fr" selected>Français</option>
    <option value="en">English</option>
    <option value="ar">العربية</option>
</select>
```

Users can select their preferred language from the dropdown on the login page. Their choice is saved in localStorage.

### 2. Adding Translations to HTML Elements

#### Text Content

For any element that needs translation:

```html
<h2 data-i18n="doctorsList">Liste des médecins</h2>
<label class="form-label" data-i18n="fullname">Nom complet</label>
<button class="btn btn-primary" data-i18n="save">Enregistrer</button>
```

#### Input Placeholders

```html
<input type="text" data-i18n-placeholder="search" placeholder="Rechercher...">
```

#### Element Titles

```html
<a href="#" data-i18n-title="deleteConfirm" title="Êtes-vous sûr ?">Delete</a>
```

### 3. Available Translation Keys

#### Navigation & Common
- `dashboard` - Dashboard
- `doctors` - Doctors/Médecins
- `patients` - Patients
- `services` - Services
- `appointments` - Appointments/Rendez-vous
- `consultations` - Consultations
- `logout` - Logout/Déconnexion
- `medicalCenter` - Medical Center/Centre Médical
- `actions` - Actions
- `search` - Search

#### Forms
- `fullname` - Full Name
- `email` - Email
- `phone` - Phone
- `address` - Address
- `specialty` - Specialty
- `available` - Available
- `age` - Age
- `gender` - Gender
- `male` - Male
- `female` - Female
- `medicalHistory` - Medical History
- `serviceName` - Service Name
- `description` - Description
- `price`/`tariff` - Price
- `date` - Date
- `time` - Time
- `status` - Status
- `doctor` - Doctor
- `patient` - Patient
- `diagnosis` - Diagnosis
- `reason` - Reason

#### Buttons
- `save` - Save/Enregistrer
- `cancel` - Cancel/Annuler
- `update` - Update/Modifier
- `delete` - Delete/Supprimer
- `back` - Back/Retour
- `edit` - Edit/Modifier

#### Page Headings
- `doctorsList` - Doctors List
- `doctorAdd` - Add Doctor
- `doctorEdit` - Edit Doctor
- `doctorDetails` - Doctor Details
- `patientsList` - Patients List
- `patientAdd` - Add Patient
- `patientEdit` - Edit Patient
- `patientDetails` - Patient Details
- `servicesList` - Services List
- `serviceAdd` - Add Service
- `serviceEdit` - Edit Service
- `serviceDetails` - Service Details
- `appointmentsList` - Appointments List
- `appointmentAdd` - New Appointment
- `appointmentEdit` - Edit Appointment
- `appointmentDetails` - Appointment Details
- `consultationsList` - Consultations List
- `consultationAdd` - New Consultation
- `consultationEdit` - Edit Consultation
- `consultationDetails` - Consultation Details

### 4. Programmatic Language Switching

If you need to change the language programmatically:

```javascript
// Access the global i18n service (initialized after DOM loads)
if (i18n) {
    // Set language
    i18n.setLanguage('en');
    
    // Get translation
    const text = i18n.t('doctorsList');
    
    // Get current language
    const currentLang = i18n.getLanguage();
}
```

### 5. Listening for Language Changes

```javascript
// Listen for language change events
document.addEventListener('languageChanged', (e) => {
    console.log('Language changed to:', e.detail.language);
    // Update your custom content here
});
```

## Files Included

- `assets/js/translations.js` - Translation service and data
- All HTML files updated with `data-i18n` attributes
- Language selector on login page

## Supported Pages

All pages support multi-language translations:

### Main Pages
- `login.html` - Login page (with language selector)
- `dashboard.html` - Main dashboard
- `index.html` - Index/redirect page

### Doctors Module
- `doctors/list.html`
- `doctors/create.html`
- `doctors/edit.html`
- `doctors/details.html`

### Patients Module
- `patients/list.html`
- `patients/create.html`
- `patients/edit.html`
- `patients/details.html`

### Services Module
- `services/list.html`
- `services/create.html`
- `services/edit.html`
- `services/details.html`

### Appointments Module
- `appointments/list.html`
- `appointments/create.html`
- `appointments/edit.html`
- `appointments/details.html`

### Consultations Module
- `consultations/list.html`
- `consultations/create.html`
- `consultations/edit.html`
- `consultations/details.html`

## Adding New Translations

To add new translation keys:

1. Open `assets/js/translations.js`
2. Add the key-value pair to all three language objects (fr, en, ar):

```javascript
const translations = {
    fr: {
        newKey: "Texte en français",
        // ... other keys
    },
    en: {
        newKey: "English text",
        // ... other keys
    },
    ar: {
        newKey: "النص بالعربية",
        // ... other keys
    }
};
```

3. Use the key in your HTML:

```html
<div data-i18n="newKey">Texte en français</div>
```

## Browser Storage

The selected language is saved in browser localStorage with the key `selectedLanguage`. This persists the user's language choice across sessions.

## RTL Layout Support

When Arabic is selected, the page automatically:
- Changes direction to right-to-left (`dir="rtl"`)
- Adjusts the HTML `lang` attribute to `ar`
- CSS should ideally be updated to support RTL layouts

## Notes

- The translation service initializes automatically when the DOM is ready
- The global `i18n` object is available once the page loads
- Fallback to French is provided if a translation key is not found
- The system supports dynamic content updates without page reload
