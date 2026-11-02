<h1 align="center">adhd-ally</h1>

<p align="center">
  <em>Explanations that click on the first or second try.</em>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/license-MIT-111111?style=flat-square" alt="MIT license">
  <img src="https://img.shields.io/badge/Claude%20Code-plugin-111111?style=flat-square" alt="Claude Code plugin">
  <img src="https://img.shields.io/badge/invoke-%2Fadhd--ally-111111?style=flat-square" alt="Invoke with /adhd-ally">
</p>

---

If you have ADHD, you may say "I don't understand" five, six, seven times before an explanation clicks. Usually the AI rewords the same explanation each time, so you get more text and no new angle.

adhd-ally is a Claude skill that fixes both halves: the first reply is short and answer-first, and every follow-up uses a **different** way of explaining.

## Before / after

You ask: *What is an API?* Without the skill you get a heading, a definition, three paragraphs, a table of HTTP methods, and a list of related terms. You say "I don't understand." You get the same thing, reworded.

With adhd-ally:

```
/adhd-ally what is an API?
```

> An API is a way for one program to ask another program for something.
> Like a waiter: you order, the kitchen cooks, the waiter brings it back.
> Recap: API = the waiter between programs.
> Next: want to see a real one?

```
/adhd-ally I don't understand
```

> Your weather app asks the weather server: "temp in Paris?" The server answers: "18". That ask and answer is the API in action.

Each reply is one new approach. More conversations in [Examples](#examples).

## How it works

**1. Reply shape.** Every reply follows the same pattern, so you know where to look:

```
[one-line answer] -> [one example OR one analogy] -> [one-line recap] -> [one next step]
```

Short sentences, plain words, jargon explained the first time it appears. One idea per message. It never asks "which part is confusing?" (that costs effort) and never says "as I said before."

**2. Confusion ladder.** Each time you call `/adhd-ally` again on the same topic and say you're lost, it moves down one rung. It reads the earlier replies in the chat and skips any rung it already used.

| Rung | Approach |
|------|----------|
| 1 | **Shorten:** one sentence, plainest words |
| 2 | **Analogy:** everyday comparison |
| 3 | **Tiny example:** real values, small numbers |
| 4 | **Step by step:** one step per line, waits for "next" |
| 5 | **Draw it:** small diagram or table |
| 6 | **Backtrack:** teach the missing basic idea first |
| 7 | **You pick:** analogy, example, diagram, or basics |

"Huh?", "wait what", "still no", or repeating the question all count as being lost. The ladder resets when you get it or change topic.

## Install

### Claude Code

```
/plugin marketplace add Khailas12/adhd-ally
```
```
/plugin install adhd-ally@adhd-ally
```

Send these as two separate prompts.

### Claude app (claude.ai or desktop)

1. Zip the `skills/adhd-ally/` folder.
2. Go to **Customize > Skills**.
3. Click **+ > Create skill > Upload a skill**.
4. Select the zip file.

### Uninstall

```
/plugin uninstall adhd-ally@adhd-ally
```

## Usage

Start a message with `/adhd-ally`:

```
/adhd-ally what is DNS?
/adhd-ally I still don't understand
```

| | |
|---|---|
| **Invocation** | Explicit only. Claude cannot load the skill on its own (`disable-model-invocation: true`). |
| **State** | None. No on or off, no hooks, no saved files. |
| **Scope** | One `/adhd-ally` message gets one ADHD-friendly reply. A message without it gets a normal reply. |
| **Follow-ups** | Call `/adhd-ally` again. It continues the ladder from the chat history. |

### Situations it handles

| If you... | It... |
|-----------|-------|
| partly get it | explains only the missing part |
| drift to another topic | answers, then offers the way back ("We were at step 2") |
| come back after a break | recaps where you stopped |
| ask several things at once | takes one, queues the rest as "Up next" |
| say "too long" | cuts the reply to one sentence |
| say "just tell me" | gives the plain answer, no ladder |
| say "I keep forgetting" | gives a memory hook and a one-line summary to save |
| feel frustrated | reassures in one line, then shrinks the chunk or suggests a break |
| paste something long | says what it is, then explains one part at a time |
| need setup steps | numbers them with progress ("Step 2 of 5") |

## Examples

Each "You" message starts with `/adhd-ally` (left out for brevity).

<details>
<summary><strong>A loop, step by step</strong></summary>

**You:** I can't focus, explain for loops.

**Claude:** A `for` loop repeats the same action several times.
Example: `for i in range(3): print("hi")` prints "hi" 3 times.
Recap: loop = repeat.
Try this: change 3 to 5. What happens?

**You:** I don't understand.

**Claude** *(rung 2, rung 1 already used)*: Like brushing every tooth. Same move, one tooth at a time, until all are done. Which tooth is "one turn" of the loop?

**You:** Still no.

**Claude** *(rung 4, rung 3 already used)*: Take `for n in [10, 20, 30]: print(n)`.
Step 1: Python takes the first value, 10. Reply "next".

**You:** next

**Claude:** Step 2: it prints 10. Reply "next".

**You:** next

**Claude:** Step 3: it goes back and takes the next value, 20. Same move again. That going back is the loop. Reply "next" for the last value.

</details>

<details>
<summary><strong>An API, ending in a diagram</strong></summary>

**You:** What is an API?

**Claude:** An API is a way for one program to ask another program for something.
Like a waiter: you order, the kitchen cooks, the waiter brings it back.
Recap: API = the waiter between programs.
Next: want to see a real one?

**You:** I don't understand.

**Claude** *(rung 3, rungs 1 and 2 already used)*: Your weather app asks the weather server: "temp in Paris?" The server answers: "18". That ask and answer is the API in action. Try this: name one app on your phone that needs info from somewhere else.

**You:** Hmm, I don't get it.

**Claude** *(rung 4)*: Step 1: the app asks the server a question. Reply "next".

**You:** next... still not clicking.

**Claude** *(rung 5)*:

```
Weather app  --- "temp in Paris?" --->  Weather server
Weather app  <--- "18"  --------------  Weather server
```

The arrows are the API. Does the picture help?

**You:** Ohh, got it.

**Claude:** Nice. In one line: an API is the set of requests a program can send, and the replies it gets back.

</details>

<details>
<summary><strong>Compound interest, with a backtrack</strong></summary>

**You:** ELI5 compound interest.

**Claude:** Compound interest means you earn interest on your interest too.
Example: $100 at 10% gives $110 after year 1, then $121 after year 2.
Recap: interest on interest.
Next: want to try year 3?

**You:** I don't understand.

**Claude** *(rung 2, rung 1 already used)*: A snowball rolling downhill. It picks up more snow, so it gets bigger faster. Your money is the snowball. Does that fit?

**You:** Still lost.

**Claude** *(rung 4, rung 3 already used)*: Step 1: start with $100. Reply "next".

**You:** next

**Claude:** Step 2: add 10% of $100, which is $10. Total $110. Reply "next".

**You:** Wait, what is a percent?

**Claude** *(backtrack)*: Good catch. A percent means "out of 100". 10% = 10 out of every 100. So 10% of $100 is $10. Ready to go back?

</details>

## Limits

- Changes how explanations are written. Not medical advice. Does not treat or diagnose ADHD.
- Safety, medical, legal, and money topics stay accurate and complete. The wording is simpler; no important warning is dropped.
- Exact code or a full document: you get the full output with a short plain summary on top.

## Files

| File | Job |
|------|-----|
| `skills/adhd-ally/SKILL.md` | The skill. All the rules live here. |
| `.claude-plugin/plugin.json` | Plugin manifest. |
| `.claude-plugin/marketplace.json` | Lets `/plugin marketplace add` find the plugin. |

## FAQ

**Does it turn on by itself when I say "I don't understand"?**
No. It runs only when your message starts with `/adhd-ally`.

**Why not always on?**
By design: it is never active unless you call it, so normal replies stay normal.

**Do I have to type `/adhd-ally` on every follow-up?**
Yes. A message without it gets a normal reply. The ladder continues because it reads the earlier `/adhd-ally` replies in the chat.

**Can I use it with caveman or ponytail?**
Yes. In testing, adhd-ally's plain sentences mostly won, but some terse caveman phrasing can leak into replies. For the cleanest result, turn caveman off while learning.

**Is this a treatment for ADHD?**
No. It only changes how explanations are written.

## License

[MIT](LICENSE)
