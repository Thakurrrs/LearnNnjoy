"use client";

import { SparkleBurst } from "@/components/sparkle-burst";
import {
  WorldActionDeck,
  WorldHud,
  WorldNova,
  WorldReward,
} from "@/components/continuous-adventure-ui";
import { shopFinalPrice, shopSaving } from "@/lib/grade-seven-worlds";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import type { ShopState } from "@/lib/grade-seven-progress";

type SmartShopperAdventureProps = {
  state: ShopState;
  onChange: (state: ShopState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  onFinish: () => void;
};

const SHOP_PROOF = "25% means one of four equal parts";

function dialogueFor(state: ShopState, heroName: string) {
  if (state.step === 0) {
    return personalize("{hero}, both sellers promise the best deal. Help me compare what we truly pay!", heroName);
  }
  if (state.step === 1 && state.showDemo) {
    return "₹240 is the whole bar. One of four equal pieces is ₹60.";
  }
  if (state.step === 1 && state.quarterPick === "₹60") {
    return "Yes. Four ₹60 pieces rebuild the whole ₹240 price.";
  }
  if (state.step === 1 && state.quarterPick) {
    return "Try your piece four times. The pieces must rebuild exactly ₹240.";
  }
  if (state.step === 1) return "Choose the amount that fits exactly four times inside ₹240.";
  if (state.step === 2 && state.discount === 25) {
    return "One quarter pops away! The ₹60 saving leaves ₹180 to pay.";
  }
  if (state.step === 2) {
    return `${state.discount}% shades ₹${shopSaving(240, state.discount)} of the whole price.`;
  }
  if (state.step === 3 && state.offer === "explorer") {
    return "₹180 is lower than ₹240. Explorer Shop keeps more coins for our journey.";
  }
  if (state.step === 3 && state.offer === "trail") {
    return "Trail Shop ends at ₹240. Compare it with Explorer Shop's final price.";
  }
  if (state.step === 3) return "Tap a shop after comparing both final prices.";
  if (state.step === 4 && state.successChoice === SHOP_PROOF) {
    return "Exactly. Percent describes an equal part of the whole amount.";
  }
  if (state.step === 4 && state.successChoice) {
    return "Look at the four equal price pieces. One shaded piece is 25%.";
  }
  return personalize("Kit packed, {hero}! Your percentage thinking saved us ₹60.", heroName);
}

function PriceBar({ discount }: { discount: number }) {
  const saving = shopSaving(240, discount);
  return (
    <div className="bazaar-price-bar" aria-label={`₹240 split into four ₹60 quarters with ${discount} percent shaded`}>
      <i className="bazaar-price-shade" style={{ width: `${discount}%` }} />
      {[1, 2, 3].map((quarter) => <em key={quarter} style={{ left: `${quarter * 25}%` }} />)}
      <span className="bazaar-quarter-labels" aria-hidden>
        <b>₹60</b><b>₹60</b><b>₹60</b><b>₹60</b>
      </span>
      <strong className={discount === 25 ? "popped" : ""}>−₹{saving}</strong>
    </div>
  );
}

function SmartShopperStage({
  state,
  heroName,
  onChange,
}: {
  state: ShopState;
  heroName: string;
  onChange: (state: ShopState) => void;
}) {
  const set = (patch: Partial<ShopState>) => onChange({ ...state, ...patch });
  const thinking = (!!state.quarterPick && state.quarterPick !== "₹60")
    || state.offer === "trail"
    || (!!state.successChoice && state.successChoice !== SHOP_PROOF);
  const showFinalPrices = state.step >= 3;

  return (
    <div className={`shop-world-stage scene-${state.step}${state.step >= 5 ? " packed" : ""}`}>
      <WorldHud label="SUNSET BAZAAR" step={state.step} />
      <div className="bazaar-sky" aria-hidden><i /><span>✦</span><span>✧</span></div>
      <div className="bazaar-lanterns" aria-hidden>{Array.from({ length: 7 }, (_, index) => <i key={index} />)}</div>
      <div className="bazaar-crowd" aria-hidden>♟︎ ♟︎ ♟︎　♟︎ ♟︎　♟︎</div>

      <WorldNova label="MARKET LINK" thinking={thinking}>
        {dialogueFor(state, heroName)}
      </WorldNova>

      <div className="bazaar-stalls">
        <button
          type="button"
          className={`bazaar-stall explorer-stall${state.offer === "explorer" ? " selected correct" : ""}`}
          disabled={state.step !== 3}
          onClick={() => { sound.play("success"); set({ offer: "explorer" }); }}
        >
          <span className="bazaar-awning" aria-hidden />
          <small>EXPLORER SHOP</small>
          <b>₹240</b>
          <strong>25% OFF</strong>
          <PriceBar discount={state.step >= 2 ? state.discount : 0} />
          <em>{showFinalPrices ? "FINAL ₹180" : "CALCULATE THE FINAL PRICE"}</em>
        </button>

        <button
          type="button"
          className={`bazaar-stall trail-stall${state.offer === "trail" ? " selected" : ""}`}
          disabled={state.step !== 3}
          onClick={() => { sound.play("tap"); set({ offer: "trail" }); }}
        >
          <span className="bazaar-awning" aria-hidden />
          <small>TRAIL SHOP</small>
          <b>₹300</b>
          <strong>20% OFF</strong>
          <div className="trail-price-pieces" aria-label="₹300 split into five ₹60 parts">
            {Array.from({ length: 5 }, (_, index) => <i key={index}>₹60</i>)}
          </div>
          <em>{showFinalPrices ? "FINAL ₹240" : "CALCULATE THE FINAL PRICE"}</em>
        </button>
      </div>

      {state.step === 1 && !state.showDemo && (
        <div className="bazaar-quarter-counter" aria-label="Choose one quarter of ₹240">
          <small>BUILD ONE QUARTER OF ₹240</small>
          <div>
            {["₹40", "₹60", "₹80", "₹120"].map((piece) => (
              <button
                key={piece}
                className={state.quarterPick === piece ? piece === "₹60" ? "selected correct" : "selected" : ""}
                onClick={() => { sound.play(piece === "₹60" ? "success" : "tap"); set({ quarterPick: piece }); }}
              >
                {piece}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.step === 4 && (
        <div className="bazaar-receipt-proof">
          <small>NOVA&apos;S RECEIPT NOTE</small>
          <strong>Why is ₹60 equal to 25% of ₹240?</strong>
          {[SHOP_PROOF, "25 always means ₹25", "₹180 is larger than ₹60"].map((choice) => (
            <button
              key={choice}
              className={state.successChoice === choice ? choice === SHOP_PROOF ? "selected correct" : "selected" : ""}
              onClick={() => {
                sound.play(choice === SHOP_PROOF ? "success" : "tap");
                set({ successChoice: choice });
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {state.step >= 5 && (
        <div className="shop-world-finale" aria-live="polite">
          <SparkleBurst playKey="shop-world-complete" />
          <span aria-hidden>🎒 🪙 🏮</span>
          <small>KIT PACKED BEFORE SUNSET</small>
          <h2>The lower final price wins.</h2>
          <p>₹240 − ₹60 = ₹180.</p>
        </div>
      )}
    </div>
  );
}

export function SmartShopperAdventure({
  state,
  onChange,
  firstTime,
  replay,
  heroName,
  onFinish,
}: SmartShopperAdventureProps) {
  const set = (patch: Partial<ShopState>) => onChange({ ...state, ...patch });
  const saving = shopSaving(240, state.discount);
  const finalPrice = shopFinalPrice(240, state.discount);

  return (
    <section className="world-adventure shop-world" aria-label="Smart Shopper percentage adventure">
      <SmartShopperStage state={state} heroName={heroName} onChange={onChange} />

      {state.step === 0 && (
        <WorldActionDeck
          eyebrow="TWO SHOPS · ONE EXPEDITION KIT"
          title="Which discount leaves the lower final price?"
          description="Explorer offers ₹240 at 25% off. Trail offers ₹300 at 20% off."
        >
          <button className="primary" onClick={() => set({ step: 1 })}>Enter the sunset bazaar →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && state.showDemo && (
        <WorldActionDeck
          eyebrow="NOVA SHOWS THE WHOLE PRICE"
          title="Twenty-five percent means one of four equal parts."
          description="The Explorer price bar has four ₹60 pieces. Together they rebuild ₹240."
        >
          <button className="primary" onClick={() => set({ showDemo: false })}>Find one quarter →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && !state.showDemo && (
        <WorldActionDeck
          eyebrow="YOUR MOVE"
          title="Choose one quarter on the market counter."
          description="Test your choice by imagining four identical pieces."
        >
          <button className="primary" disabled={state.quarterPick !== "₹60"} onClick={() => set({ step: 2 })}>Use the price dial →</button>
        </WorldActionDeck>
      )}

      {state.step === 2 && (
        <WorldActionDeck
          eyebrow="CHANGE THE REAL PRICE BAR"
          title="Set Explorer Shop to exactly 25% off."
          description={`Saving ₹${saving}. Final price ₹${finalPrice}.`}
        >
          <input
            className="world-range"
            aria-label="Explorer Shop discount percentage"
            type="range"
            min="0"
            max="50"
            step="5"
            value={state.discount}
            onChange={(event) => set({ discount: Number(event.target.value) })}
          />
          <div className="world-stepper">
            <button onClick={() => set({ discount: Math.max(0, state.discount - 5) })}>− 5%</button>
            <b>{state.discount}%</b>
            <button onClick={() => set({ discount: Math.min(50, state.discount + 5) })}>+ 5%</button>
          </div>
          <button className="primary" disabled={state.discount !== 25} onClick={() => set({ step: 3 })}>Compare both shopfronts →</button>
        </WorldActionDeck>
      )}

      {state.step === 3 && (
        <WorldActionDeck
          eyebrow="MAKE THE BUYING DECISION"
          title="Tap the shop with the lower final price."
          description="The discounts differ, so compare rupees paid—not the signs."
        >
          <button className="primary" disabled={state.offer !== "explorer"} onClick={() => set({ step: 4 })}>Write Nova&apos;s receipt note →</button>
        </WorldActionDeck>
      )}

      {state.step === 4 && (
        <WorldActionDeck
          eyebrow="EXPLAIN THE SAVING"
          title="Connect 25%, one quarter, and ₹60."
          description="Choose the reason on Nova's receipt inside the bazaar."
        >
          <button className="primary" disabled={state.successChoice !== SHOP_PROOF} onClick={() => set({ step: 5 })}>Pack the expedition kit →</button>
        </WorldActionDeck>
      )}

      {state.step === 5 && (
        <WorldActionDeck
          eyebrow={replay ? "JOURNAL REPLAY COMPLETE" : "SMART SHOP COMPLETE"}
          title={personalize("You saved sixty rupees, {hero}.", heroName)}
          description="The percentage became a visible part of the whole price."
        >
          <WorldReward replay={replay} firstTime={firstTime} />
          <button className="primary" onClick={onFinish}>
            {replay ? "Return to my journal →" : "Return to the star map →"}
          </button>
        </WorldActionDeck>
      )}
    </section>
  );
}
