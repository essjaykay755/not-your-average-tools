"use client";

import React, { useState, useCallback } from 'react';
import { RefreshCw, Copy, Check, User, Mail, Phone, MapPin, Building, Hash, Download } from 'lucide-react';

const FIRST_NAMES = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth', 'David', 'Sarah', 'Aiden', 'Emma', 'Liam', 'Olivia', 'Noah', 'Ava'];
const LAST_NAMES = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore'];
const DOMAINS = ['gmail.com', 'yahoo.com', 'outlook.com', 'hotmail.com', 'example.com', 'company.io'];
const STREETS = ['Main St', 'Oak Ave', 'Maple Dr', 'Cedar Ln', 'Pine Rd', 'Elm St', 'Park Ave', 'Lake Dr'];
const CITIES = ['New York', 'Los Angeles', 'Chicago', 'Houston', 'Phoenix', 'San Diego', 'Dallas', 'Austin'];
const STATES = ['NY', 'CA', 'TX', 'FL', 'IL', 'PA', 'OH', 'GA'];
const COMPANIES = ['Acme Corp', 'Globex Inc', 'Umbrella Co', 'Initech', 'Hooli', 'Stark Industries', 'Wayne Enterprises'];
const JOB_TITLES = ['Software Engineer', 'Product Manager', 'Designer', 'Data Analyst', 'Marketing Manager', 'Sales Rep', 'Project Manager'];

interface FakeData {
    firstName: string; lastName: string; email: string; phone: string;
    address: string; company: string; jobTitle: string; uuid: string;
}

const random = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const randomDigits = (len: number): string => Array.from({ length: len }, () => Math.floor(Math.random() * 10)).join('');
const formatPhone = (): string => `(${randomDigits(3)}) ${randomDigits(3)}-${randomDigits(4)}`;
const generateUUID = (): string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
    const r = Math.random() * 16 | 0;
    return (c === 'x' ? r : (r & 0x3 | 0x8)).toString(16);
});

const generatePerson = (): FakeData => {
    const firstName = random(FIRST_NAMES);
    const lastName = random(LAST_NAMES);
    return {
        firstName, lastName,
        email: `${firstName.toLowerCase()}.${lastName.toLowerCase()}@${random(DOMAINS)}`,
        phone: formatPhone(),
        address: `${Math.floor(Math.random() * 9999) + 1} ${random(STREETS)}, ${random(CITIES)}, ${random(STATES)} ${randomDigits(5)}`,
        company: random(COMPANIES),
        jobTitle: random(JOB_TITLES),
        uuid: generateUUID(),
    };
};

const Field: React.FC<{ icon: React.ReactNode; label: string; value: string; onCopy: () => void; copied: boolean }> = ({ icon, label, value, onCopy, copied }) => (
    <div className="group bg-gray-50 dark:bg-white/5 rounded-2xl p-4 hover:bg-gray-100 dark:hover:bg-white/10 transition-colors">
        <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3 min-w-0">
                <div className="p-2 rounded-xl bg-white dark:bg-white/5 text-primary shrink-0">{icon}</div>
                <div className="min-w-0">
                    <p className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">{label}</p>
                    <p className="text-text-main dark:text-white font-medium break-all">{value}</p>
                </div>
            </div>
            <button onClick={onCopy} className="p-2 rounded-lg hover:bg-white dark:hover:bg-white/10 text-gray-400 hover:text-primary transition-colors shrink-0">
                {copied ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4" />}
            </button>
        </div>
    </div>
);

export const FakeDataTool: React.FC = () => {
    const [people, setPeople] = useState<FakeData[]>(() => Array.from({ length: 3 }, generatePerson));
    const [count, setCount] = useState(3);
    const [copiedField, setCopiedField] = useState<string | null>(null);

    const regenerate = useCallback(() => setPeople(Array.from({ length: count }, generatePerson)), [count]);

    const copyField = async (id: string, value: string) => {
        await navigator.clipboard.writeText(value);
        setCopiedField(id);
        setTimeout(() => setCopiedField(null), 2000);
    };

    const exportAsJSON = () => {
        const blob = new Blob([JSON.stringify(people, null, 2)], { type: 'application/json' });
        const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'fake-data.json'; a.click();
    };

    return (
        <div className="w-full flex flex-col gap-6">
            <div className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5">
                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                    <div className="flex items-center gap-4">
                        <label className="text-sm font-medium text-text-main dark:text-white">Generate</label>
                        <select value={count} onChange={(e) => setCount(Number(e.target.value))} className="px-4 py-2 rounded-xl bg-gray-50 dark:bg-white/5 border border-gray-200 dark:border-white/10 text-text-main dark:text-white font-medium">
                            {[1, 3, 5, 10, 25].map(n => <option key={n} value={n}>{n} {n === 1 ? 'person' : 'people'}</option>)}
                        </select>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={regenerate} className="px-6 py-3 bg-primary hover:bg-primary-dark text-white rounded-xl font-bold flex items-center gap-2 transition-colors">
                            <RefreshCw className="w-5 h-5" /> Generate
                        </button>
                        <button onClick={exportAsJSON} className="px-4 py-3 bg-gray-100 dark:bg-white/5 hover:bg-gray-200 dark:hover:bg-white/10 text-text-main dark:text-white rounded-xl font-medium flex items-center gap-2 transition-colors">
                            <Download className="w-4 h-4" /> JSON
                        </button>
                    </div>
                </div>
            </div>

            <div className="bg-green-50 dark:bg-green-900/10 rounded-2xl p-4 border border-green-200 dark:border-green-800">
                <p className="text-sm text-green-700 dark:text-green-300 text-center">✨ <strong>100% Fake & Private</strong> — All data is randomly generated in your browser.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
                {people.map((person, idx) => (
                    <div key={idx} className="bg-white dark:bg-surface-dark rounded-3xl p-6 border border-gray-200 dark:border-white/5 space-y-3">
                        <div className="flex items-center gap-3 pb-4 border-b border-gray-100 dark:border-white/5">
                            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-lg">{person.firstName[0]}{person.lastName[0]}</div>
                            <div>
                                <h3 className="font-bold text-lg text-text-main dark:text-white">{person.firstName} {person.lastName}</h3>
                                <p className="text-sm text-gray-400">{person.jobTitle}</p>
                            </div>
                        </div>
                        <Field icon={<Mail className="w-4 h-4" />} label="Email" value={person.email} onCopy={() => copyField(`${idx}-email`, person.email)} copied={copiedField === `${idx}-email`} />
                        <Field icon={<Phone className="w-4 h-4" />} label="Phone" value={person.phone} onCopy={() => copyField(`${idx}-phone`, person.phone)} copied={copiedField === `${idx}-phone`} />
                        <Field icon={<MapPin className="w-4 h-4" />} label="Address" value={person.address} onCopy={() => copyField(`${idx}-address`, person.address)} copied={copiedField === `${idx}-address`} />
                        <Field icon={<Building className="w-4 h-4" />} label="Company" value={person.company} onCopy={() => copyField(`${idx}-company`, person.company)} copied={copiedField === `${idx}-company`} />
                        <Field icon={<Hash className="w-4 h-4" />} label="UUID" value={person.uuid} onCopy={() => copyField(`${idx}-uuid`, person.uuid)} copied={copiedField === `${idx}-uuid`} />
                    </div>
                ))}
            </div>
        </div>
    );
};
