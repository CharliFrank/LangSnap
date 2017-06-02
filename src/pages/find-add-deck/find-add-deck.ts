import { Component, ViewChild } from '@angular/core';
import { NavController, Nav } from 'ionic-angular';
import { MyDecksPage } from '../my-decks/my-decks';
import { TranslateService } from '@ngx-translate/core';
import { OAuthService } from '../oauth/oauth.service';
import { LanguageService } from '../../services/language.service';
import { DeckService } from '../../services/deck.service';
import { CameraService } from '../../services/camera.service';
import { CardViewerPage } from '../card-viewer/card-viewer'

@Component({
  selector: 'page-find-add-deck',
  templateUrl: 'find-add-deck.html',
})
export class FindAddDeckPage {
  @ViewChild(Nav) nav: Nav;
  
  public rootPage: any = FindAddDeckPage;
  public profile: any;
  public items: any;
  constructor(public navCtrl: NavController, 
  public translateService: TranslateService,
  oauthService: OAuthService,
  public languageService: LanguageService,
  public cameraService: CameraService,
  public deckService: DeckService) {
    oauthService.getProfile().toPromise()
         .then(profile => {
        console.log(profile, 'profile')
        this.profile = profile;
        translateService.use(languageService.translateLang(this.profile.nativeLang));
        this.deckService.getAllDecks()
      })
      .catch(err => {
        console.log("Error" + JSON.stringify(err))
      });
    // this.initializeItems();
    this.cameraService.showLoading(3000);
    setTimeout(() => {

      this.items = this.deckService.allDecks.map((deck) => {
        if (!deck.cards[0]) { deck.cards[0] = { imgUrl: "https://www.wired.com/wp-content/uploads/2015/01/learning-styles.jpg" } }
        return deck;
      })
    }, 2000)

  }









  //   ngOnInit() {
  
    
  // }
  
  // initializeItems() {
  //   this.items = this.deckService.allDecks;
  // }

  // openCard(){
   
  //   this.deckService.getUsersDecks(1);
  //   this.navCtrl.setRoot(MyDecksPage);
  // }

  // getItems(ev) {
  //   // Reset items back to all of the items
  //   this.initializeItems();

  //   // set val to the value of the ev target
  //   var val = ev.target.value;

  //   // if the value is an empty string don't filter the items
  //   if (val && val.trim() != '') {
  //     this.items = this.items.filter((item) => {
  //       return (item.toLowerCase().indexOf(val.toLowerCase()) > -1);
  //     })
  //   }
  // }
 
    openCard(deckId) {
    console.log(deckId)
    console.log("deckId")
    this.deckService.getAllCardsInADeck(deckId);
    this.navCtrl.setRoot(CardViewerPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindAddDeckPage');
  }

  addDeck() {
    console.log('add deck button clicked')
    this.navCtrl.setRoot(MyDecksPage)
  }
}