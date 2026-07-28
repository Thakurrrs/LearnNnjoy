"use client";

import { SparkleBurst } from "@/components/sparkle-burst";
import {
  WorldActionDeck,
  WorldHud,
  WorldNova,
  WorldReward,
} from "@/components/continuous-adventure-ui";
import { balanceEquation } from "@/lib/grade-seven-worlds";
import { personalize } from "@/lib/personalize";
import { sound } from "@/lib/sound";
import type { BalanceState } from "@/lib/grade-seven-progress";

type BalanceLabAdventureProps = {
  state: BalanceState;
  onChange: (state: BalanceState) => void;
  firstTime: boolean;
  replay: boolean;
  heroName: string;
  onFinish: () => void;
};

const FAIR_MOVE = "Remove blocks from both sides";
const ONE_SIDE_MOVE = "Remove blocks from only one side";
const BALANCE_PROOF = "Do the same thing to both sides";

function dialogueFor(state: BalanceState, heroName: string) {
  if (state.step === 0) {
    return personalize("{hero}, my supply crate is locked. Its energy scale needs our help!", heroName);
  }
  if (state.step === 1 && state.showDemo) {
    return state.demoMode === "tipped"
      ? "I changed one side. The beam tips because the two sides stopped matching."
      : "I changed both sides equally. The beam stays level and the equality survives.";
  }
  if (state.step === 1 && state.removed < 5) {
    return `Both sides lost ${state.removed} blocks. The beam still tells the truth.`;
  }
  if (state.step === 1) return "The crate stands alone. Seven blocks balance its hidden value!";
  if (state.step === 2 && state.rule === ONE_SIDE_MOVE) {
    return "That changes only one side. The beam warns us by tipping.";
  }
  if (state.step === 2 && state.rule === FAIR_MOVE) {
    return "Yes. Equal changes keep the two sides equal.";
  }
  if (state.step === 2) return "The repair console needs a move that keeps both sides fair.";
  if (state.step === 3 && state.value && state.value !== "7") {
    return "Five blocks left both sides. Count what still balances the crate.";
  }
  if (state.step === 3 && state.value === "7") return "Seven! The lock recognises the value hidden by the crate.";
  if (state.step === 3) return "The lock asks what remains after five leaves both sides.";
  if (state.step === 4 && state.successChoice && state.successChoice !== BALANCE_PROOF) {
    return "An equation stays true only when both sides receive the same change.";
  }
  if (state.step === 4 && state.successChoice === BALANCE_PROOF) {
    return "That is the rule. Fair moves protect every equation.";
  }
  return personalize("The crate is open, {hero}. Your fair moves revealed seven!", heroName);
}

function EnergyBlocks({ count }: { count: number }) {
  return (
    <span className="balance-energy-blocks" aria-label={`${count} energy blocks`}>
      {Array.from({ length: count }, (_, index) => <i key={index}>✦</i>)}
    </span>
  );
}

function BalanceStage({
  state,
  heroName,
  onChange,
}: {
  state: BalanceState;
  heroName: string;
  onChange: (state: BalanceState) => void;
}) {
  const equation = balanceEquation(state.removed);
  const demoTilt = state.step === 1 && state.showDemo && state.demoMode === "tipped";
  const crateOpen = state.step >= 5;
  const thinking = state.rule === ONE_SIDE_MOVE
    || (!!state.value && state.value !== "7")
    || (!!state.successChoice && state.successChoice !== BALANCE_PROOF);
  const set = (patch: Partial<BalanceState>) => onChange({ ...state, ...patch });

  return (
    <div className={`balance-world-stage scene-${state.step}${crateOpen ? " powered" : ""}`}>
      <WorldHud label="EQUALITY ENERGY LAB" step={state.step} />
      <div className="balance-world-glow" aria-hidden />
      <div className="balance-world-pipes" aria-hidden><i /><i /><i /><i /></div>
      <div className="balance-world-coils" aria-hidden><i>ϟ</i><i>ϟ</i></div>

      <WorldNova label="LAB LINK" thinking={thinking}>
        {dialogueFor(state, heroName)}
      </WorldNova>

      <div className={`balance-world-machine${demoTilt ? " tipped" : ""}`}>
        <div className="balance-world-beam">
          <div className="balance-world-pan left-pan">
            <span className={`mystery-crate${crateOpen ? " open" : ""}`}>
              <b>{crateOpen ? "7" : "?"}</b><i />
            </span>
            <EnergyBlocks count={state.step === 1 && state.showDemo ? (demoTilt ? 2 : 3) : equation.leftBlocks} />
          </div>
          <span className="balance-world-pivot"><i>⚖</i></span>
          <div className="balance-world-pan right-pan">
            <EnergyBlocks count={state.step === 1 && state.showDemo ? 3 : equation.rightBlocks} />
          </div>
        </div>
        <div className="balance-equation-screen">
          {state.step === 1 && state.showDemo
            ? demoTilt ? "3 ≠ 2" : "3 = 3"
            : `? + ${equation.leftBlocks} = ${equation.rightBlocks}`}
        </div>
      </div>

      {state.step === 2 && (
        <div className="balance-world-console" aria-label="Choose the fair repair move">
          <small>FAIRNESS CONSOLE</small>
          <strong>Which move keeps the beam level?</strong>
          <button
            className={state.rule === FAIR_MOVE ? "selected correct" : ""}
            onClick={() => { sound.play("success"); set({ rule: FAIR_MOVE }); }}
          >
            Both sides lose five
          </button>
          <button
            className={state.rule === ONE_SIDE_MOVE ? "selected" : ""}
            onClick={() => { sound.play("tap"); set({ rule: ONE_SIDE_MOVE }); }}
          >
            Only one side loses five
          </button>
        </div>
      )}

      {state.step === 3 && (
        <div className="balance-world-keypad" aria-label="Enter the crate value">
          <small>CRATE VALUE</small>
          <strong>? + 5 = 12</strong>
          <div>
            {["5", "7", "12"].map((choice) => (
              <button
                key={choice}
                className={state.value === choice ? choice === "7" ? "selected correct" : "selected" : ""}
                onClick={() => { sound.play(choice === "7" ? "success" : "tap"); set({ value: choice }); }}
              >
                {choice}
              </button>
            ))}
          </div>
        </div>
      )}

      {state.step === 4 && (
        <div className="balance-world-proof">
          <small>FINAL SAFETY CHECK</small>
          <strong>What keeps an equation balanced?</strong>
          {[BALANCE_PROOF, "Change only the larger side", "Move a number without changing it"].map((choice) => (
            <button
              key={choice}
              className={state.successChoice === choice ? choice === BALANCE_PROOF ? "selected correct" : "selected" : ""}
              onClick={() => {
                sound.play(choice === BALANCE_PROOF ? "success" : "tap");
                set({ successChoice: choice });
              }}
            >
              {choice}
            </button>
          ))}
        </div>
      )}

      {crateOpen && (
        <div className="balance-world-finale" aria-live="polite">
          <SparkleBurst playKey="balance-world-complete" />
          <span aria-hidden>📦 ✦ ⚖️</span>
          <small>ENERGY RESTORED</small>
          <h2>Fair moves opened the crate.</h2>
          <p>? + 5 = 12 became ? = 7.</p>
        </div>
      )}
    </div>
  );
}

export function BalanceLabAdventure({
  state,
  onChange,
  firstTime,
  replay,
  heroName,
  onFinish,
}: BalanceLabAdventureProps) {
  const set = (patch: Partial<BalanceState>) => onChange({ ...state, ...patch });
  const equation = balanceEquation(state.removed);
  const complete = state.removed === 5;

  return (
    <section className="world-adventure balance-world" aria-label="Balance Lab equation adventure">
      <BalanceStage state={state} heroName={heroName} onChange={onChange} />

      {state.step === 0 && (
        <WorldActionDeck
          eyebrow="LOCKED SUPPLY CRATE"
          title="A mystery value is hiding in the balance."
          description="The crate plus five energy blocks balances twelve blocks."
        >
          <button className="primary" onClick={() => set({ step: 1 })}>Enter the energy lab →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && state.showDemo && (
        <WorldActionDeck
          eyebrow="NOVA SHOWS THE FAIRNESS RULE"
          title="Change one side and the beam tips."
          description="Change both sides equally and it stays level. Try both on the real beam."
        >
          <div className="world-button-row">
            <button onClick={() => set({ demoMode: "tipped" })}>Change one side</button>
            <button onClick={() => set({ demoMode: "level" })}>Change both sides</button>
          </div>
          <button className="primary" onClick={() => set({ showDemo: false, demoMode: "level" })}>Take the controls →</button>
        </WorldActionDeck>
      )}

      {state.step === 1 && !state.showDemo && (
        <WorldActionDeck
          eyebrow="YOUR MOVE"
          title="Remove five blocks from both sides."
          description={`The live equation is ? + ${equation.leftBlocks} = ${equation.rightBlocks}.`}
        >
          <div className="world-stepper">
            <button disabled={state.removed === 0} onClick={() => set({ removed: state.removed - 1 })}>Put one back</button>
            <b>{state.removed}/5 fair moves</b>
            <button disabled={complete} onClick={() => { sound.play("tap"); set({ removed: state.removed + 1 }); }}>Remove one each</button>
          </div>
          <button className="primary" disabled={!complete} onClick={() => set({ step: 2 })}>Check the fairness console →</button>
        </WorldActionDeck>
      )}

      {state.step === 2 && (
        <WorldActionDeck
          eyebrow="READ THE MACHINE"
          title="Choose the repair inside the lab."
          description="The beam itself will show whether the move is fair."
        >
          <button className="primary" disabled={state.rule !== FAIR_MOVE} onClick={() => set({ step: 3 })}>Enter the crate value →</button>
        </WorldActionDeck>
      )}

      {state.step === 3 && (
        <WorldActionDeck
          eyebrow="REVEAL THE MYSTERY"
          title="What value was hiding under the crate?"
          description="Five left both sides. Seven energy blocks remain."
        >
          <button className="primary" disabled={state.value !== "7"} onClick={() => set({ step: 4 })}>Run the safety check →</button>
        </WorldActionDeck>
      )}

      {state.step === 4 && (
        <WorldActionDeck
          eyebrow="PROVE THE DISCOVERY"
          title="Protect the rule for every equation."
          description="Choose the rule on the machine, then Nova can open the crate."
        >
          <button className="primary" disabled={state.successChoice !== BALANCE_PROOF} onClick={() => set({ step: 5 })}>Open Nova&apos;s crate →</button>
        </WorldActionDeck>
      )}

      {state.step === 5 && (
        <WorldActionDeck
          eyebrow={replay ? "JOURNAL REPLAY COMPLETE" : "EQUATION LAB COMPLETE"}
          title={personalize("The energy is flowing again, {hero}.", heroName)}
          description="The crate was seven because equal changes kept the equation true."
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
