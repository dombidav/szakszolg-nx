import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EnterTokenPageRoutingModule } from './enter-token-routing.module';

import { EnterTokenPage } from './enter-token.page';
import {ButtonModule} from "primeng/button";
import {NxSharedModule} from "../../../shared/nx-shared.module";
import {TranslateModule} from "@ngx-translate/core";

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        EnterTokenPageRoutingModule,
        ButtonModule,
        NxSharedModule,
        TranslateModule
    ],
  declarations: [EnterTokenPage]
})
export class EnterTokenPageModule {}
