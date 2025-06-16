import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';
import { SpAtInput } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-at-input';
import { SpTpDashboard } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-tp-dashboard';
import { SpMlSidebar } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-ml-sidebar';
import { SpMlHeader } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-ml-header';
import { SpAtLogo } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-at-logo';
import { SpMlDynamicTable } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-ml-dynamic-table';
import { SpMlOverflowMenu } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-ml-overflow-menu';
import { SpAtTooltip } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-at-tooltip';
import { SpAtTag } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-at-tag';
import { SpAtCheckButton } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-at-check-button';
import { SpMlPagination } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-ml-pagination';
import { SpAtDropdown } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-at-dropdown';
import { SpMlSearchInput } from '@npm-bbta/bbog-dig-dt-sherpa-lib/dist/custom-elements/sp-ml-search-input';

const defineSherpaComponents = () => {
    customElements.define('sp-tp-dashboard', SpTpDashboard);
    customElements.define('sp-ml-sidebar', SpMlSidebar);
    customElements.define('sp-ml-header', SpMlHeader);
    customElements.define('sp-at-logo', SpAtLogo);
    customElements.define('sp-ml-dynamic-table', SpMlDynamicTable);
    customElements.define('sp-ml-overflow-menu', SpMlOverflowMenu);
    customElements.define('sp-at-tooltip', SpAtTooltip);
    customElements.define('sp-at-tag', SpAtTag);
    customElements.define('sp-at-check-button', SpAtCheckButton);
    customElements.define('sp-ml-pagination', SpMlPagination);
    customElements.define('sp-at-dropdown', SpAtDropdown);
    customElements.define('sp-ml-search-input', SpMlSearchInput);
    customElements.define('sp-at-input', SpAtInput);
}

defineSherpaComponents();

bootstrapApplication(App, appConfig)
  .catch((err) => console.error(err));

