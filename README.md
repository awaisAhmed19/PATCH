# PATCH – AI-Powered Patch Prioritization from Nmap Scans

---

##  WHAT IS THIS TOOL?

### In one sentence:

**It’s a tool that reads Nmap network scan results and uses an AI (LLM) to tell you which services on your network need urgent patching — with clean recommendations and a downloadable report.**

---
https://drive.google.com/drive/folders/1PDOhWjj6KM2h3NbdbLc7jR7KCoNbkjKp?usp=sharing
## WHY BUILD THIS?

Because:

- IT/security teams scan their networks (using Nmap or similar tools)
- The output is massive, technical, and hard to prioritize
- They often don't know:
  - Which services are outdated?
  - What patches are needed?
  - What’s risky and what’s not?

So we built a tool that **reads that mess**, uses **AI to interpret and explain it**, and **spits out something actually useful**, like:

-  "Upgrade Apache on 192.168.0.12 to version 2.4.57"
-  "MySQL 5.6 is 10 years old and vulnerable to CVE-XXXX — patch ASAP"
-  "These 3 hosts are highest risk — prioritize them"

---

## KEY FEATURES

| Feature              | What It Does                                                                 |
|----------------------|------------------------------------------------------------------------------|
| **Nmap XML Parser**   | Reads an XML file from Nmap and extracts each host, service, and version    |
| **LLM Integration**   | Sends data to an AI (like Gemini/GPT) to determine outdated/vulnerable services |
| **Patch Prioritizer** | Assigns High/Medium/Low risk levels based on severity and known exploits     |
| **Report Generator**  | Creates clean reports summarizing findings and patch instructions           |
| **User Interface**    | Upload Nmap scans, view AI-generated insights, and download the final report |

---

## EXAMPLE FLOW

### Step 1: Nmap Scan Result (input)

```xml
<host>
  <address addr="192.168.0.12" />
  <port protocol="tcp" portid="80">
    <service name="http" product="Apache httpd" version="2.4.10"/>
  </port>
</host>
```
### Step 2: Tool Parses It
```json
{
  "host": "192.168.0.12",
  "services": [
    {
      "name": "Apache",
      "version": "2.4.10",
      "port": 80
    }
  ]
}
```
---
### Step 3: Tool Asks LLM
- "Is Apache 2.4.10 vulnerable? If yes, what’s the risk and patch recommendation?"
---
### Step 4: LLM Responds
- "Yes. Apache 2.4.10 is vulnerable to CVE-2017-15710. This could allow a remote attacker to crash the server. It is recommended to upgrade to version 2.4.57."
---

### Step 5: Tool Prioritizes Risk
```json

{
  "risk": "High",
  "recommended_patch": "Upgrade to Apache 2.4.57"
}
```
---
### Step 6: Results Displayed in UI
#### Example Vulnerability Table

| Host         | Service | Version | Risk | Patch Recommendation         |
|--------------|---------|---------|------|-------------------------------|
| 192.168.0.12 | Apache  | 2.4.10  | **High** | Upgrade to Apache 2.4.57      |

---
### Step 7: Report Generation
A downloadable PDF report that includes:

- Executive Summary
- Table of vulnerabilities
- Patch instructions from the LLM
- CVE references
- Risk categories
---
### WHAT DOES THE LLM DO?
The LLM (Large Language Model) interprets version and service data and answers:

- Why it’s risky
- What CVEs are associated with that version
- How to patch or upgrade
- Whether it’s critical or low risk

### WHO IS THIS FOR?
- Cybersecurity analysts looking for quick triage
- System administrators maintaining internal servers
- Small IT teams who scan but don’t have time to dig through version history
- Anyone who uses Nmap but wants a cleaner way to understand the results
## BEFORE vs AFTER – Why PATCH Matters

| Without PATCH                                | With PATCH                                             |
|---------------------------------------------|--------------------------------------------------------|
| You get a huge Nmap XML file                | Upload the file to PATCH                               |
| You Google each service/version manually    | LLM explains vulnerabilities and patches automatically |
| Hard to know what’s urgent                  | PATCH gives risk scores and patch recommendations      |
| Manual effort to create a report            | One-click PDF with everything you need                 |

### FINAL NOTE
PATCH doesn’t replace your scan — it amplifies it.

It bridges the gap between raw network data and clear remediation strategy. Whether you're a solo IT admin or a full-blown red team, PATCH lets you go from:

```
🤷 "What do I do with this scan?"
to

✅ "Here’s what to fix, how, and how urgent it is."
Built for clarity. Backed by AI. Ready to patch.
```
