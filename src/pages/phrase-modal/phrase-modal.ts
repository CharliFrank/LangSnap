import { Component } from '@angular/core';
import { NavController, NavParams,  ViewController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { LanguageService } from '../../services/language.service';
import { OAuthService } from '../oauth/oauth.service';
import { PhraseService } from '../../services/phrase.service';

@Component({
  selector: 'page-phrase-modal',
  templateUrl: 'phrase-modal.html',

})
export class PhraseModalPage {
  public rootPage: any = PhraseModalPage;
  private profile: any;
  private phrase: string;
  private sentence: string;

  constructor(public navCtrl: NavController, 
  public navParams: NavParams, 
  public viewCtrl: ViewController,
  private oauthService: OAuthService,
  private translateService: TranslateService,
  private languageService: LanguageService,
  private phraseService: PhraseService) {
    oauthService.getProfile().toPromise()
      .then(profile => {
        console.log(profile, 'profile')
        this.profile = profile;
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.phraseService.setTargetTrasnlationLang(languageService.translateLang(this.profile.nativeLang), languageService.translateLang(this.profile.learnLang))
        this.phraseService.getPhrase(navParams.get('word'));
        setTimeout(() => {
          this.getPhrases();
        }, 800)
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
  }
  getPhrases() {
    this.phrase = this.phraseService.translatedPhrase;
    this.sentence = this.phraseService.nativeSentence;
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad PhraseModalPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }

}
