import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { testSupabaseConnection, testAuth, type ConnectionTestResult } from '@/utils/connectionTest';
import { CheckCircle2, XCircle, RefreshCw, AlertCircle } from 'lucide-react';
import { supabase } from '@/db/supabase';

export default function Diagnostics() {
  const [connectionTest, setConnectionTest] = useState<ConnectionTestResult | null>(null);
  const [authTest, setAuthTest] = useState<ConnectionTestResult | null>(null);
  const [testing, setTesting] = useState(false);
  const [localStorageData, setLocalStorageData] = useState<string>('');

  useEffect(() => {
    runTests();
    checkLocalStorage();
  }, []);

  const checkLocalStorage = () => {
    try {
      const authData = localStorage.getItem('tapandbuy-auth');
      if (authData) {
        const parsed = JSON.parse(authData);
        setLocalStorageData(JSON.stringify(parsed, null, 2));
      } else {
        setLocalStorageData('No auth data found in localStorage');
      }
    } catch (error) {
      setLocalStorageData('Error reading localStorage');
    }
  };

  const runTests = async () => {
    setTesting(true);
    
    const connResult = await testSupabaseConnection();
    setConnectionTest(connResult);
    
    const authResult = await testAuth();
    setAuthTest(authResult);
    
    setTesting(false);
  };

  const clearCache = () => {
    localStorage.clear();
    sessionStorage.clear();
    window.location.reload();
  };

  const testDirectQuery = async () => {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .limit(5);

      if (error) {
        alert(`Query Error: ${error.message}`);
      } else {
        alert(`Success! Found ${data?.length || 0} categories`);
        console.log('Categories:', data);
      }
    } catch (error: unknown) {
      const err = error as Error;
      alert(`Network Error: ${err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>System Diagnostics</CardTitle>
            <CardDescription>
              This page helps diagnose connection and authentication issues
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Button onClick={runTests} disabled={testing}>
                <RefreshCw className={`mr-2 h-4 w-4 ${testing ? 'animate-spin' : ''}`} />
                Run Tests
              </Button>
              <Button onClick={testDirectQuery} variant="outline">
                Test Direct Query
              </Button>
              <Button onClick={clearCache} variant="destructive">
                Clear Cache & Reload
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Connection Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {connectionTest?.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Supabase Connection Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            {connectionTest ? (
              <div className="space-y-2">
                <Alert className={connectionTest.success ? 'border-green-500' : 'border-red-500'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{connectionTest.message}</AlertDescription>
                </Alert>
                
                {connectionTest.details && (
                  <div className="bg-muted p-4 rounded-md text-sm font-mono">
                    <div><strong>Supabase URL:</strong> {connectionTest.details.supabaseUrl}</div>
                    <div><strong>Has Anon Key:</strong> {connectionTest.details.hasAnonKey ? 'Yes' : 'No'}</div>
                    <div><strong>Can Connect:</strong> {connectionTest.details.canConnect ? 'Yes' : 'No'}</div>
                    {connectionTest.details.error && (
                      <div className="text-red-500 mt-2">
                        <strong>Error:</strong> {connectionTest.details.error}
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">Click "Run Tests" to check connection</div>
            )}
          </CardContent>
        </Card>

        {/* Auth Test */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {authTest?.success ? (
                <CheckCircle2 className="h-5 w-5 text-green-500" />
              ) : (
                <XCircle className="h-5 w-5 text-red-500" />
              )}
              Authentication Test
            </CardTitle>
          </CardHeader>
          <CardContent>
            {authTest ? (
              <div className="space-y-2">
                <Alert className={authTest.success ? 'border-green-500' : 'border-red-500'}>
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{authTest.message}</AlertDescription>
                </Alert>
                
                {authTest.details?.error && (
                  <div className="bg-muted p-4 rounded-md text-sm font-mono text-red-500">
                    <strong>Error:</strong> {authTest.details.error}
                  </div>
                )}
              </div>
            ) : (
              <div className="text-muted-foreground">Click "Run Tests" to check auth</div>
            )}
          </CardContent>
        </Card>

        {/* LocalStorage Data */}
        <Card>
          <CardHeader>
            <CardTitle>LocalStorage Auth Data</CardTitle>
            <CardDescription>Current authentication data stored in browser</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="bg-muted p-4 rounded-md text-xs overflow-auto max-h-96">
              {localStorageData}
            </pre>
          </CardContent>
        </Card>

        {/* Environment Variables */}
        <Card>
          <CardHeader>
            <CardTitle>Environment Variables</CardTitle>
            <CardDescription>Configuration status</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                {import.meta.env.VITE_SUPABASE_URL ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>VITE_SUPABASE_URL: {import.meta.env.VITE_SUPABASE_URL || 'MISSING'}</span>
              </div>
              <div className="flex items-center gap-2">
                {import.meta.env.VITE_SUPABASE_ANON_KEY ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>VITE_SUPABASE_ANON_KEY: {import.meta.env.VITE_SUPABASE_ANON_KEY ? 'SET' : 'MISSING'}</span>
              </div>
              <div className="flex items-center gap-2">
                {import.meta.env.VITE_APP_ID ? (
                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                ) : (
                  <XCircle className="h-4 w-4 text-red-500" />
                )}
                <span>VITE_APP_ID: {import.meta.env.VITE_APP_ID || 'MISSING'}</span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Troubleshooting Steps */}
        <Card>
          <CardHeader>
            <CardTitle>Troubleshooting Steps</CardTitle>
          </CardHeader>
          <CardContent>
            <ol className="list-decimal list-inside space-y-2 text-sm">
              <li>If connection test fails: Check your internet connection</li>
              <li>If auth test fails: Clear cache and log in again</li>
              <li>If environment variables are missing: Contact administrator</li>
              <li>If direct query fails: Supabase service might be down</li>
              <li>Try opening the application in incognito/private mode</li>
              <li>Check browser console (F12) for detailed error messages</li>
            </ol>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
