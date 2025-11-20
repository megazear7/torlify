import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import {
  bookContext,
  BookContext,
  BooksContext,
  booksContext,
} from "./context.book.js";
import { consume } from "@lit/context";
import { globalStyles } from "./styles.global.js";
import "./component.modal.js";
import { aiIcon, homeIcon } from "./icons.js";
import "./component.modal.js";
import "./component.loading-overlay.js";
import { dispatch } from "./util.events.js";
import { generateBookService } from "../shared/service.generate-book.js";
import { pillStyles } from "./styles.pill.js";
import { NavigationEvent } from "./event.navigation.js";
import { WarningEvent } from "./event.warning.js";
import { SuccessEvent } from "./event.success.js";

@customElement("torlify-book-list")
export class TorlifyBookList extends LitElement {
  static override styles = [
    globalStyles,
    pillStyles,
    css`
      :host {
        scroll-margin-top: var(--size-xl);
      }
    `,
  ];

  @consume({ context: booksContext, subscribe: true })
  @property({ attribute: false })
  booksContext: BooksContext = {
    status: LoadingStatus.enum.idle,
  };

  @consume({ context: bookContext, subscribe: true })
  @property({ attribute: false })
  bookContext: BookContext = {
    status: LoadingStatus.enum.idle,
  };

  @property({ type: String })
  generateBookInstructions = "";

  @property({ type: String })
  sampleDescription: string = "";

  @property({ type: String })
  loading: boolean = false;

  @property({ type: Array })
  sampleDescriptions: string[] = [
    "A valiant knight scaled the tower to the true Princess. A dragon loomed, but the knights courage shone. With a swift strike...",
    "The space warrior, clad in shimmering armor, battled through asteroid storms. His laser blade carved enemy drones. A distress signal flickered...",
    "In a realm where magic thrived, a young sorcerer discovered an ancient spellbook. As he chanted the incantations, mystical energies swirled around him. Suddenly...",
    "Sun blazed, waves crashed. She lounged on soft sand, sipping cool lemonade. Kids built castles, giggling. Evening brought a bonfire; marshmallows roasted...",
    "Amidst towering skyscrapers, a detective pursued a cunning thief. Clues led through bustling markets and shadowy alleys. A rooftop chase ensued...",
    "Beneath the ocean waves, a mermaid explored vibrant coral reefs. Schools of fish danced around her as she uncovered hidden treasures. Suddenly...",
    "In a post-apocalyptic world, a lone survivor navigated desolate landscapes. Scavenging for supplies, he encountered other survivors. Together, they faced looming threats...",
    "High in the mountains, a monk trained in ancient martial arts. Through discipline and meditation, he mastered his skills. One day, a rival clan challenged him...",
    "On a distant planet, explorers uncovered alien ruins. Strange symbols glowed on the walls as they ventured deeper. Suddenly, an otherworldly presence awakened...",
    "In a quaint village, a baker crafted magical pastries. Each treat brought joy and wonder to the townsfolk. One day, a mysterious traveler arrived...",
    "A brilliant scientist invented a time machine. Testing it, she found herself in a prehistoric era. Dinosaurs roamed, and survival became paramount. Suddenly...",
    "In a bustling city, a street artist painted vibrant murals. His art sparked conversations and inspired change. One evening, he unveiled his masterpiece...",
    "Amidst a dense jungle, an adventurer sought a legendary temple. Guided by ancient maps, he faced wild creatures and treacherous terrain. Finally...",
    "In a futuristic metropolis, a hacker fought against a corrupt corporation. Using advanced technology, she exposed secrets and rallied allies. A digital battle ensued...",
    "On a remote island, a group of friends discovered a hidden cave. Inside, glowing crystals illuminated ancient drawings. As they explored, they uncovered a long-lost secret...",
    "In a snowy wilderness, a mountaineer braved harsh conditions. Battling blizzards and icy cliffs, he sought the summit. Suddenly...",
    "A young musician dreamed of stardom. Practicing tirelessly, she composed melodies that captivated hearts. One night, an unexpected opportunity arose...",
    "In a magical forest, fairies danced under moonlight. Their laughter echoed as they weaved spells of enchantment. A curious human stumbled upon their realm...",
    "Beneath the city streets, a secret society thrived. Members exchanged coded messages and plotted grand schemes. A new recruit uncovered a hidden agenda...",
    "In a war-torn land, a courageous soldier led a rebellion. Rallying villagers and strategizing battles, hope flickered amidst despair. A decisive confrontation loomed...",
    "A brilliant inventor created a robot companion. Together, they embarked on adventures, exploring uncharted territories. One day, they encountered a mysterious signal...",
    "In a serene countryside, a gardener nurtured rare plants. Each bloom held unique properties, attracting curious visitors. One afternoon, a peculiar seed sprouted...",
    "Amidst swirling galaxies, a starship captain navigated cosmic phenomena. Facing alien encounters and interstellar challenges, the crew forged unbreakable bonds. Suddenly...",
    "In a hidden valley, mythical creatures roamed freely. A young explorer documented their behaviors, forging friendships. One day, a looming threat emerged...",
    "On a distant moon, colonists struggled to survive. Harsh environments and scarce resources tested their resilience. A daring expedition sought new hope...",
    "In a vibrant carnival, performers dazzled audiences with feats of skill. Acrobats soared, magicians mystified, and clowns entertained. Behind the scenes, a secret rivalry brewed...",
    "A skilled archer defended her village from marauding invaders. With precision and agility, she thwarted attacks and inspired courage. A final showdown approached...",
    "A roman soldier embarked on a quest to retrieve a sacred relic. Traversing treacherous terrains and facing mythical beasts, his resolve was tested. Finally...",
    "A general strategized to unite warring factions. Through diplomacy and tactical brilliance, he forged alliances. A decisive battle loomed...",
    "In a mystical land, a dragon rider soared through skies. Bonded with her dragon, they protected villages from threats. A legendary foe emerged...",
  ];

  override connectedCallback(): void {
    super.connectedCallback();
    this.chooseSampleDescription();
  }

  override render(): TemplateResult {
    return html`
      <ul class="pill">
        <li><a href="/">${homeIcon}</a></li>
        ${this.booksContext.books?.map(
          (book) => html`
            <li
              class="${this.bookContext.book?.id === book.id ? "active" : ""}"
            >
              <a href="/book/${book.id}">${book.title}</a>
            </li>
          `,
        ) ?? html`<li>No books found</li>`}
        <li>
          <torlify-modal @ModelSubmit="${this.handleCreateBook}">
            <button slot="open-button">${aiIcon} Create</button>
            <div slot="body">
              <h2>Add Book</h2>
              <torlify-auto-textarea
                .value="${this.generateBookInstructions}"
                @input="${this.handleGenerateBookInstructions}"
                placeholder="${this.sampleDescription}"
              ></torlify-auto-textarea>
            </div>
            <button class="standard-button" slot="submit-button">
              ${aiIcon} Generate
            </button>
          </torlify-modal>
        </li>
      </ul>

      <torlify-loading-overlay
        .visible="${this.loading}"
      ></torlify-loading-overlay>
    `;
  }

  private readonly handleGenerateBookInstructions = (event: Event): void => {
    const target = event.target as HTMLTextAreaElement;
    this.generateBookInstructions = target.value;
  };

  private readonly handleCreateBook = async (): Promise<void> => {
    this.loading = true;
    try {
      const book = await generateBookService.fetch({
        instructions: this.generateBookInstructions || this.sampleDescription,
      });
      dispatch(this, NavigationEvent({ path: `/book/${book.id}` }));
    } catch {
      dispatch(this, WarningEvent("Failed to create book. Please try again."));
    } finally {
      dispatch(this, SuccessEvent("Book created successfully."));
      this.loading = false;
    }
  };

  chooseSampleDescription(): void {
    const index = Math.floor(Math.random() * this.sampleDescriptions.length);
    this.sampleDescription = this.sampleDescriptions[index];
  }
}
