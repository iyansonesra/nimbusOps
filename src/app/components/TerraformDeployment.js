import React, { useState } from 'react';

import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
// import { Loader2 } from 'lucide-react';

const TerraformDeployment = ({ terraformCode }) => {
  const [isApplying, setIsApplying] = useState(false);
  const [deploymentError, setDeploymentError] = useState(null);
  const [websiteUrl, setWebsiteUrl] = useState(null);

  const applyTerraform = async () => {
    setIsApplying(true);
    setDeploymentError(null);
    
    try {
      const response = await fetch('http://127.0.0.1:5000/apply_terraform', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      });

      if (!response.ok) {
        throw new Error('Deployment failed');
      }

      const data = await response.json();
      setWebsiteUrl(data.website_url);
    } catch (error) {
      setDeploymentError('Failed to apply Terraform configuration. Please try again.');
      console.error('Deployment error:', error);
    } finally {
      setIsApplying(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Terraform Code Display */}
      <Card className="bg-gray-900 p-4 w-full max-w-4xl">
        <CardContent>
          <pre className="text-white font-mono text-sm overflow-x-auto">
            {terraformCode}
          </pre>
        </CardContent>
      </Card>

      {/* Deploy Button */}
      <div className="flex justify-center">
        <Button 
          onClick={applyTerraform}
          disabled={isApplying}
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded"
        >
          {isApplying ? (
            <>
              {/* <Loader2 className="mr-2 h-4 w-4 animate-spin" /> */}
              Applying Terraform...
            </>
          ) : (
            'Apply Terraform'
          )}
        </Button>
      </div>

      {/* Error Message */}
      {deploymentError && (
        <Alert variant="destructive">
          <AlertDescription>{deploymentError}</AlertDescription>
        </Alert>
      )}

      {/* Website Preview */}
      {websiteUrl && (
        <div className="space-y-4">
          <Alert>
            <AlertDescription>
              Deployment successful! Your website is available at:{' '}
              <a 
                href={websiteUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:text-blue-600 underline"
              >
                {websiteUrl}
              </a>
            </AlertDescription>
          </Alert>
          
          <Card className="w-full max-w-4xl mx-auto">
            <CardContent className="p-0">
              <iframe
                src={websiteUrl}
                title="Website Preview"
                className="w-full h-96 border-0"
              />
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TerraformDeployment;