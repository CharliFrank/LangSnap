import { Component, ViewChild } from '@angular/core';
import { NavController, Nav, AlertController } from 'ionic-angular';
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

  public profile: any;
  public items: any;
  public chosenDecks: Array<any>;
  public displayDecks: Array<any> = [];

  constructor(public navCtrl: NavController,
    public alertCtrl: AlertController,
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
    this.cameraService.showLoading(3000);
    setTimeout(() => {

      this.items = this.deckService.allDecks.map((deck) => {
        deck['status'] = '';
        if (!deck.cards[0]) {
          deck.cards[0] = { imgUrl: "https://www.wired.com/wp-content/uploads/2015/01/learning-styles.jpg", status: "" }
        }
        console.log('DECK');
        console.log(JSON.stringify(deck));
        return deck;
      })
      this.initializeItems();
    }, 1500)

  }

  initializeItems() {
    this.chosenDecks = [];
    this.items = this.deckService.allDecks;
  }

  getItems(ev) {
    // Reset items back to all of the items
    this.initializeItems();
    // set val to the value of the ev target
    var val = ev.target.value;
    console.log("target letter", val)
    // if the value is an empty string don't filter the items
    if (val && val.trim() != '') {
      this.items = this.items.filter((item) => {
        if ((item.name.toLowerCase().indexOf(val.toLowerCase()) > -1)) { console.log(item.name.toLowerCase) }
        return (item.name.toLowerCase().indexOf(val.toLowerCase()) > -1);
      })
    }
  }

  openCard(deckId) {
    console.log(deckId)
    console.log("deckId")
    this.deckService.getAllCardsInADeck(deckId);
    this.navCtrl.push(CardViewerPage)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FindAddDeckPage');
  }

  addDeckToUser(deckId, index) {

    console.log('deck');
    // this.chosenDecks.push(deck);
    console.log(index);
    console.log(JSON.stringify(this.items));
    let pos = this.chosenDecks.indexOf(deckId);
      this.items[+index]["status"] = "added!";
    if (pos === -1) {
      this.chosenDecks.push(deckId);
      this.displayDecks.push(index);
    } else if (pos !== -1) {
      this.items[+index]["status"] = "";
      this.chosenDecks[pos] = -1;
      this.displayDecks[pos] = -1;
    }
    console.log(deckId);
    console.log(this.chosenDecks);

  }
  editDeck() {
    this.navCtrl.setRoot(MyDecksPage)
  }
  addDecks() {
    this.chosenDecks = this.chosenDecks.filter(el => el !== -1);
    let body = {
      "user_id": this.profile.id,
      "decks": JSON.stringify(this.chosenDecks)
    }

    console.log('add deck button clicked')
    this.deckService.addDecksToUser(body);
    this.navCtrl.setRoot(MyDecksPage)

  }

}