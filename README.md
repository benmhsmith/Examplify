# Examplify

Free, open-source study tools for IT certification exams. Each tool drills the topics an exam actually tests, tracks what you have mastered, and gives you timed practice exams with performance-based questions (PBQs).

Examplify works three ways: in your web browser, as a single file you can keep offline, or inside the [Joplin](https://joplinapp.org/) note-taking app on desktop and Android.

**[Open the website →](https://benmhsmith.github.io/examplify/)**

<p align="center"><img src="docs/images/home.png" alt="Examplify Network+ home page: the CompTIA Network+ N10-009 title, the official domain weighting bar, and the first study modules with their ranks." width="860"></p>

## Choose your exam

| Exam | Exam code | Status | Start here |
|---|---|---|---|
| CompTIA Network+ | N10-009 | **Available** | [Examplify Network+](certs/network-plus/) |
| CompTIA Security+ | Current version when built | Planned | — |
| CompTIA A+ | Current version when built | Planned | — |

## See it in action

| Hands-on PBQs with real command output | Cable tester wire maps and port diagnostics |
|---|---|
| <img src="docs/images/pbq-vlan.png" alt="VLAN and trunk troubleshooting PBQ: a switch console showing show spanning-tree output." width="420"> | <img src="docs/images/pbq-cable.png" alt="Cable diagnostics PBQ: a wire map with a short between pins 1 and 2, plus switch port status." width="420"> |
| **Routing tables you build and test** | **A NOC dashboard to read like a pro** |
| <img src="docs/images/pbq-routing.png" alt="Routing PBQ: a four-router network diagram with tickets to solve." width="420"> | <img src="docs/images/pbq-noc.png" alt="NOC monitoring dashboard PBQ showing wireless access point statistics." width="420"> |
| **Ranks that show what you have actually mastered** | **Works on your phone, light or dark** |
| <img src="docs/images/modules.png" alt="Module list with ranks from Beginner to Expert and progress bars." width="420"> | <img src="docs/images/phone-security.png" alt="Security Drill on a phone in dark mode, with topic progress chips and a question." width="200"> |

## New to this? Start here

You don't need to know anything about GitHub to use Examplify.

1. **Find your exam** in the table above and click its link.
2. **Pick how you want to study.** The exam's page explains each option in plain steps:
   - **In your browser:** nothing to install. Works on computers, tablets, and phones.
   - **As a file:** download one `.html` file and open it, even with no internet.
   - **In Joplin:** install the plugin and the tool opens inside your study notes.
3. **Follow the modules in order.** Each tool is laid out in stages, from vocabulary to full practice exams.

Your progress is saved on your own device. Nothing is sent anywhere.

## Where to download

Every version is published on the [Releases page](https://github.com/benmhsmith/examplify/releases). Each release has:

- `examplify-<exam>-vX.Y.Z.jpl`: the Joplin plugin
- `Examplify-<Exam>-vX.Y.Z.html`: the standalone web page

## How this repository is organized

```
examplify/
├── README.md            ← you are here
├── certs/               ← one folder per exam
│   └── network-plus/    ← Examplify Network+: source, Joplin plugin, changelog
├── core/                ← shared engine (planned; see core/README.md)
└── docs/                ← the website served by GitHub Pages
```

- **Students** only need the exam's page and the Releases page.
- **Instructors** can find each tool's coverage and the changelog in its exam folder.
- **Contributors** should read [CONTRIBUTING.md](CONTRIBUTING.md).

## License

Examplify is free software under the [GNU General Public License v3.0](LICENSE). You may use, share, and change it. If you share a changed version, it must stay under the same license with its source available.

Third-party parts keep their own licenses; see [NOTICE.md](NOTICE.md).

CompTIA, Network+, Security+, and A+ are trademarks of CompTIA, Inc. Examplify is an independent project and is not affiliated with, sponsored by, or endorsed by CompTIA. It contains no CompTIA exam questions.
