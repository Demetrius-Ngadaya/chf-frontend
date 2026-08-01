"use client";

import { useState } from "react";
import SiteHeader from "@/components/SiteHeader";
import Footer from "@/components/Footer";

const SKILLS = [
  "Nursing",
  "Counseling",
  "Data Entry",
  "Community Outreach",
  "Logistics",
  "Teaching",
];

const INTERESTS = [
  "Maternal Health",
  "Youth Programs",
  "Fundraising",
  "Nutrition",
  "GBV Prevention",
];

export default function VolunteerPage() {
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [gender, setGender] = useState("");
  const [education, setEducation] = useState("");
  const [occupation, setOccupation] = useState("");
  const [skills, setSkills] = useState<string[]>([]);
  const [interests, setInterests] = useState<string[]>([]);
  const [availability, setAvailability] = useState("");
  const [experience, setExperience] = useState("");
  const [motivation, setMotivation] = useState("");
  const [status, setStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");
  const [message, setMessage] = useState<string | null>(null);

  function toggle(list: string[], setList: (v: string[]) => void, value: string) {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("submitting");
    setMessage(null);

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/volunteers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({
          full_name: fullName,
          phone,
          email,
          gender: gender || null,
          education: education || null,
          occupation: occupation || null,
          skills,
          areas_of_interest: interests,
          availability: availability || null,
          experience: experience || null,
          motivation_letter: motivation || null,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message);
      } else {
        setStatus("error");
        setMessage(data.message ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Could not reach the server. Please try again.");
    }
  }

  return (
    <>
      <SiteHeader />
      <main className="bg-sand px-6 py-16 md:px-12">
        <div className="mx-auto max-w-xl">
          <p className="mb-3 font-mono text-xs uppercase tracking-[0.2em] text-clay">
            Get Involved
          </p>
          <h1 className="font-display text-4xl text-ink md:text-5xl">
            Become a Volunteer
          </h1>
          <p className="mt-4 font-body text-ink/60">
            Join our team of volunteers making a difference across Tanzania.
          </p>

          {status === "success" ? (
            <div className="mt-10 rounded-lg border border-baobab/30 bg-baobab/5 p-6">
              <p className="font-body text-sm text-baobab">{message}</p>
            </div>
          ) : (
            <form
              onSubmit={handleSubmit}
              className="mt-10 rounded-lg border border-ink/10 bg-white p-6"
            >
              {status === "error" && message && (
                <p className="mb-4 rounded bg-clay/10 px-3 py-2 font-body text-sm text-clay">
                  {message}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Full Name
                  </label>
                  <input
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Gender (optional)
                  </label>
                  <select
                    value={gender}
                    onChange={(e) => setGender(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  >
                    <option value="">Prefer not to say</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Phone
                  </label>
                  <input
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Email
                  </label>
                  <input
                    required
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
              </div>

              <div className="mt-4 grid grid-cols-2 gap-4">
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Education (optional)
                  </label>
                  <input
                    value={education}
                    onChange={(e) => setEducation(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
                <div>
                  <label className="font-body text-sm text-ink/70">
                    Occupation (optional)
                  </label>
                  <input
                    value={occupation}
                    onChange={(e) => setOccupation(e.target.value)}
                    className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Skills (select any that apply)
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SKILLS.map((skill) => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => toggle(skills, setSkills, skill)}
                      className={`rounded-full px-3 py-1 font-body text-xs ${
                        skills.includes(skill)
                          ? "bg-baobab text-sand"
                          : "border border-ink/20 text-ink/70"
                      }`}
                    >
                      {skill}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Areas of Interest
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {INTERESTS.map((interest) => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => toggle(interests, setInterests, interest)}
                      className={`rounded-full px-3 py-1 font-body text-xs ${
                        interests.includes(interest)
                          ? "bg-baobab text-sand"
                          : "border border-ink/20 text-ink/70"
                      }`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Availability (optional)
                </label>
                <input
                  placeholder="e.g. Weekends, Flexible"
                  value={availability}
                  onChange={(e) => setAvailability(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Relevant Experience (optional)
                </label>
                <textarea
                  rows={2}
                  value={experience}
                  onChange={(e) => setExperience(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>

              <div className="mt-4">
                <label className="font-body text-sm text-ink/70">
                  Why do you want to volunteer with us? (optional)
                </label>
                <textarea
                  rows={3}
                  value={motivation}
                  onChange={(e) => setMotivation(e.target.value)}
                  className="mt-1 w-full rounded border border-ink/15 px-3 py-2 font-body text-sm outline-none focus:border-baobab"
                />
              </div>

              <button
                type="submit"
                disabled={status === "submitting"}
                className="mt-6 w-full rounded-full bg-baobab px-6 py-3 font-body text-sm font-semibold text-sand transition-transform hover:scale-[1.02] disabled:opacity-50"
              >
                {status === "submitting" ? "Submitting..." : "Submit Application"}
              </button>
            </form>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
