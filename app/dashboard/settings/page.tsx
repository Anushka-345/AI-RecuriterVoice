'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Settings, Bell, Key, Mic, Mail } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Settings</h1>
        <p className="text-slate-600 mt-2">
          Configure your AI Recruiter platform settings
        </p>
      </div>

      <div className="grid gap-6">
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mic className="h-5 w-5 text-slate-600" />
              <CardTitle>Voice AI Configuration</CardTitle>
            </div>
            <CardDescription>
              Configure AI voice settings for automated interviews
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="voice_provider">Voice Provider</Label>
              <Input
                id="voice_provider"
                placeholder="Murf AI / Falcon AI"
                defaultValue="Murf AI"
              />
              <p className="text-xs text-slate-600">
                Configure your preferred voice AI provider for interviews
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="voice_api_key">Voice API Key</Label>
              <Input
                id="voice_api_key"
                type="password"
                placeholder="Enter your voice API key"
              />
              <p className="text-xs text-slate-600">
                Your API key for voice AI integration (stored securely)
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Enable Voice AI</Label>
                <p className="text-sm text-slate-600">
                  Activate AI-powered voice interviews
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <Button>Save Voice Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Mail className="h-5 w-5 text-slate-600" />
              <CardTitle>Email Notifications</CardTitle>
            </div>
            <CardDescription>
              Configure email notifications for candidates and team
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="smtp_host">SMTP Host</Label>
              <Input id="smtp_host" placeholder="smtp.sendgrid.net" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="smtp_api_key">SMTP API Key</Label>
              <Input id="smtp_api_key" type="password" placeholder="Your SMTP API key" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="from_email">From Email</Label>
              <Input id="from_email" type="email" placeholder="noreply@company.com" />
            </div>

            <Separator />

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Interview Scheduled</Label>
                  <p className="text-sm text-slate-600">
                    Notify candidates when interviews are scheduled
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Interview Reminders</Label>
                  <p className="text-sm text-slate-600">
                    Send reminders 24 hours before interview
                  </p>
                </div>
                <Switch defaultChecked />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>Report Generated</Label>
                  <p className="text-sm text-slate-600">
                    Notify team when reports are ready
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>

            <Separator />

            <Button>Save Email Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Key className="h-5 w-5 text-slate-600" />
              <CardTitle>API Integration</CardTitle>
            </div>
            <CardDescription>
              Configure third-party integrations and API keys
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="openai_key">OpenAI API Key</Label>
              <Input
                id="openai_key"
                type="password"
                placeholder="sk-..."
              />
              <p className="text-xs text-slate-600">
                Used for AI-powered candidate screening and report generation
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="nlp_key">NLP Service API Key</Label>
              <Input
                id="nlp_key"
                type="password"
                placeholder="Enter NLP API key"
              />
              <p className="text-xs text-slate-600">
                For sentiment analysis and language processing
              </p>
            </div>

            <Separator />

            <Button>Save API Settings</Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-slate-600" />
              <CardTitle>General Settings</CardTitle>
            </div>
            <CardDescription>
              General platform preferences
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="company_name">Company Name</Label>
              <Input id="company_name" placeholder="Your Company Name" />
            </div>

            <div className="space-y-2">
              <Label htmlFor="timezone">Timezone</Label>
              <Input id="timezone" defaultValue="UTC" />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>Auto-generate Reports</Label>
                <p className="text-sm text-slate-600">
                  Automatically generate reports after interviews
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label>AI Candidate Screening</Label>
                <p className="text-sm text-slate-600">
                  Use AI to automatically screen candidates
                </p>
              </div>
              <Switch defaultChecked />
            </div>

            <Separator />

            <Button>Save General Settings</Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
