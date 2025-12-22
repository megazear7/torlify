import { css, html, LitElement, TemplateResult } from "lit";
import { customElement, property, query, queryAll } from "lit/decorators.js";
import { LoadingStatus } from "../shared/type.loading.js";
import { bookContext, BookContext, BooksContext, booksContext } from "./context.js";
import { consume } from "@lit/context";
import { globalStyles } from "./styles.global.js";
import "./component.modal.js";
import { aiIcon, homeIcon } from "./icons.js";
import "./component.modal.js";
import "./component.loading-overlay.js";
import "./component.number-slider.js";
import { dispatch } from "./util.events.js";
import { generateBookService } from "../shared/service.generate-book.js";
import { pillStyles } from "./styles.pill.js";
import { NavigationEvent } from "./event.navigation.js";
import { WarningEvent } from "./event.warning.js";
import { InklifyAutoTextarea } from "./component.auto-textarea.js";
import { wait } from "../shared/util.wait.js";
import { InklifyModal } from "./component.modal.js";
import { createBookService } from "../shared/service.create-book.js";
import {
  MAXIMUM_NUMBER_OF_CHAPTERS,
  MAXIMUM_PART_LENGTH,
  MINIMUM_NUMBER_OF_CHAPTERS,
  MINIMUM_PART_LENGTH,
} from "../shared/type.book.js";

@customElement("inklify-book-list")
export class InklifyBookList extends LitElement {
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

  @property({ type: Number })
  generateBookNumberOfChapters = 3;

  @property({ type: Number })
  generateBookPartLength = 600;

  @property({ type: String })
  sampleDescription: string = "";

  @property({ type: String })
  loading: boolean = false;

  @property({ type: String })
  public loadingMessage: string = "Loading";

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
    "An explorer charted unknown territories. Facing natural hazards and discovering hidden civilizations, his journey was perilous. Suddenly...",
    "In a hidden cave, he stumbled upon an ancient artifact that could change everything.",
    "A young girl discovered a mysterious book in her attic. As she read, the words came alive, transporting her to fantastical realms.",
    "A detective received an anonymous tip about a series of unsolved crimes. As she delved deeper, she uncovered a web of secrets and lies.",
    "A scientist invented a device that could communicate with animals. Testing it on her dog led to unexpected adventures and revelations.",
    "In a small town, a bakery became the center of magical happenings when the pastries started granting wishes.",
    "A musician found an old guitar that, when played, could influence the emotions of anyone who heard it.",
    "A photographer captured a ghostly figure in one of his photos, leading him to investigate a local legend.",
    "A chef discovered a rare spice that enhanced the flavors of his dishes, attracting food critics from far and wide.",
    "A gardener found a hidden garden where the plants grew in extraordinary ways, revealing secrets of nature.",
    "A teacher uncovered a hidden talent in one of her students, leading to a journey of self-discovery for both.",
    "A pilot crash-landed on a deserted island, where he found unexpected companionship and adventure.",
    "A writer struggling with writer's block found inspiration in a mysterious café that appeared only at midnight.",
    "A sailor embarked on a voyage to find a legendary island said to hold untold treasures and dangers.",
    "A historian uncovered a lost civilization's artifacts that challenged everything known about history.",
    "A dancer discovered a new style that captivated audiences and changed the world of dance forever.",
    "A fashion designer created a revolutionary fabric that adapted to the wearer's mood and environment.",
    "A filmmaker stumbled upon a hidden society that lived by its own rules, inspiring his next big project.",
    "A teacher found a magical chalk that brought drawings to life, leading to whimsical classroom adventures.",
    "A librarian discovered a secret section in the library filled with books that transported readers to other worlds.",
    "A scientist developed a potion that granted temporary superhuman abilities, leading to thrilling escapades.",
    "A photographer captured a moment that revealed a hidden dimension overlapping with our own.",
    "A knight on a quest to find a mythical sword that could save his kingdom from impending doom.",
    "A pirate searching for a legendary treasure hidden on a cursed island, facing supernatural challenges.",
    "An astronaut on a mission to explore a newly discovered planet that harbors alien life forms.",
    "A spy infiltrating a secret organization to prevent a global catastrophe, navigating danger at every turn.",
    "A wizard apprentice learning to harness his powers while uncovering a dark plot against the magical realm.",
    "A superhero balancing everyday life with the responsibility of protecting the city from villains.",
    "A detective solving a series of mysterious disappearances in a small town with a dark secret.",
    "A time traveler trying to fix historical events while avoiding paradoxes and altering the future.",
    "A vampire navigating the complexities of immortality while seeking redemption for past sins.",
    "A werewolf struggling to control his transformations while protecting his loved ones from danger.",
    "A ghost haunting an old mansion, trying to communicate with the living to resolve unfinished business.",
    "A mermaid exploring the human world while protecting her underwater kingdom from threats.",
  ];

  @queryAll("inklify-modal inklify-auto-textarea")
  private modalTextAreas!: NodeListOf<InklifyAutoTextarea>;

  @query("#create-book-modal")
  private createBookModal!: InklifyModal;

  override connectedCallback(): void {
    super.connectedCallback();
    this.chooseSampleDescription();
  }

  override render(): TemplateResult {
    return html`
      <ul class="pill">
        <li><a href="/">${homeIcon}&nbsp;Home</a></li>
        <li>
          <inklify-modal
            id="create-book-modal"
            @ModelSubmit=${this.handleGenerateBook}
            @ModelOpening=${this.handleOpenModal}>
            <button slot="open-button">${aiIcon} Create</button>
            <div slot="body">
              <h2>Create Book</h2>
              <inklify-auto-textarea
                .value="${this.generateBookInstructions}"
                @input=${this.handleGenerateBookInstructions}
                placeholder="${this.sampleDescription}"></inklify-auto-textarea>
              <inklify-number-slider
                min="${MINIMUM_NUMBER_OF_CHAPTERS}"
                max="${MAXIMUM_NUMBER_OF_CHAPTERS}"
                label="Number of Chapters"
                .value=${this.generateBookNumberOfChapters}
                @input=${this.handleGenerateBookNumberOfChapters}></inklify-number-slider>
              <inklify-number-slider
                min="${MINIMUM_PART_LENGTH}"
                max="${MAXIMUM_PART_LENGTH}"
                step="10"
                label="Part Length"
                .value=${this.generateBookPartLength}
                @input=${this.handleGenerateBookPartLength}></inklify-number-slider>
              <inklify-bar>
                <button class="standard-button" @click=${this.handleGenerateBook}>${aiIcon} Generate</button>
                <button class="standard-button" @click=${this.handleCreateBook}>Create Empty</button>
              </inklify-bar>
            </div>
          </inklify-modal>
        </li>
        ${this.booksContext.books?.map(
          (book) => html`
            <li class="${this.bookContext.book?.id === book.id ? "active" : ""}">
              <a href="/book/${book.id}">${book.title}</a>
            </li>
          `,
        ) ??
        html`
          <li>No books found</li>
        `}
      </ul>

      <inklify-loading-overlay .visible="${this.loading}" message="${this.loadingMessage}"></inklify-loading-overlay>
    `;
  }

  private async handleOpenModal(): Promise<void> {
    await wait(10);
    this.modalTextAreas.forEach((textarea) => textarea.adjustHeight());
  }

  private readonly handleGenerateBookInstructions = (event: Event): void => {
    const target = event.target as HTMLTextAreaElement;
    this.generateBookInstructions = target.value;
  };

  private readonly handleGenerateBookNumberOfChapters = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.generateBookNumberOfChapters = Number(target.value);
  };

  private readonly handleGenerateBookPartLength = (event: Event): void => {
    const target = event.target as HTMLInputElement;
    this.generateBookPartLength = Number(target.value);
  };

  private readonly handleCreateBook = async (): Promise<void> => {
    this.createBookModal.close();
    this.loading = true;
    this.loadingMessage = "Creating book";
    try {
      const book = await createBookService.fetch({
        instructions: this.generateBookInstructions || this.sampleDescription,
        numberOfChapters: this.generateBookNumberOfChapters,
        partLength: this.generateBookPartLength,
      });
      dispatch(this, NavigationEvent({ path: `/book/${book.id}` }));
    } catch (error) {
      console.error("Create book failed:", error);
      dispatch(this, WarningEvent("Failed to create book."));
    } finally {
      this.loading = false;
    }
  };

  private readonly handleGenerateBook = async (): Promise<void> => {
    this.createBookModal.close();
    this.loading = true;
    this.loadingMessage = "Generating book";
    try {
      const book = await generateBookService.fetch({
        instructions: this.generateBookInstructions || this.sampleDescription,
        numberOfChapters: this.generateBookNumberOfChapters,
        partLength: this.generateBookPartLength,
      });
      dispatch(this, NavigationEvent({ path: `/book/${book.id}` }));
    } catch {
      dispatch(this, WarningEvent("Failed to create book. Please try again."));
    } finally {
      this.loading = false;
    }
  };

  chooseSampleDescription(): void {
    const index = Math.floor(Math.random() * this.sampleDescriptions.length);
    this.sampleDescription = this.sampleDescriptions[index];
  }
}
