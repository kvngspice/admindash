import React, { useState } from 'react';
import { Card, Form, Button, Alert, ProgressBar } from 'react-bootstrap';

const InfluencerUpload = () => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setError(null);
    setResult(null);
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      setError('Please select a file to upload');
      return;
    }
    
    // Check file type
    if (!file.name.endsWith('.xlsx') && !file.name.endsWith('.xls')) {
      setError('Please upload an Excel file (.xlsx or .xls)');
      return;
    }
    
    setLoading(true);
    setError(null);
    
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/admin/upload-influencers-excel/', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`
        },
        body: formData
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }
      
      setResult(data);
    } catch (err) {
      setError(err.message || 'Failed to upload file');
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Card>
      <Card.Header>
        <h4>Upload Influencers from Excel</h4>
      </Card.Header>
      <Card.Body>
        {error && <Alert variant="danger">{error}</Alert>}
        
        {result && (
          <Alert variant="success">
            <p>{result.message}</p>
            <p>Successfully processed: {result.success_count}</p>
            {result.error_count > 0 && (
              <>
                <p>Errors: {result.error_count}</p>
                <ul>
                  {result.errors.map((err, index) => (
                    <li key={index}>{err}</li>
                  ))}
                </ul>
                {result.errors.length < result.error_count && (
                  <p>...and {result.error_count - result.errors.length} more errors</p>
                )}
              </>
            )}
          </Alert>
        )}
        
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Excel File</Form.Label>
            <Form.Control 
              type="file" 
              onChange={handleFileChange}
              accept=".xlsx,.xls"
            />
            <Form.Text className="text-muted">
              Upload an Excel file with columns: name, platform, followers_count, niche, etc.
            </Form.Text>
          </Form.Group>
          
          {loading && (
            <ProgressBar animated now={100} className="mb-3" />
          )}
          
          <Button 
            type="submit" 
            variant="primary"
            disabled={loading || !file}
          >
            {loading ? 'Uploading...' : 'Upload Influencers'}
          </Button>
        </Form>
        
        <div className="mt-4">
          <h5>Required Excel Format</h5>
          <p>Your Excel file should have the following columns:</p>
          <ul>
            <li><strong>name</strong> - Influencer's full name</li>
            <li>
              <strong>platform</strong> - Platform information in the format: 
              <code>"Twitter: @username (1135 followers) - https://x.com/username"</code>
            </li>
          </ul>
          <p>Optional columns:</p>
          <ul>
            <li><strong>niche</strong> - Content category/niche</li>
            <li><strong>email</strong> - Email address</li>
            <li><strong>phone</strong> - Phone number</li>
            <li><strong>gender</strong> - Gender (Male, Female, Other)</li>
            <li><strong>region</strong> - Geographic region</li>
            <li><strong>country</strong> - Country</li>
            <li><strong>bio</strong> - Short biography</li>
            <li><strong>demography</strong> - Target audience age range</li>
          </ul>
          <div className="alert alert-info">
            <strong>Note:</strong> The Excel file should match the format from the Quick Influencer Registration form.
            It should include columns for name, platform, niche, region, demography, and bio.
          </div>
          <div className="alert alert-warning">
            <strong>Important:</strong> The system will automatically skip rows with "DATA RECEIVED" in the name column.
            The platform column can contain multiple platforms, each on a new line, in formats like:
            <ul className="mb-0 mt-2">
              <li><code>Instagram: @temi_ajao (30400 followers) - https://www.instagram.com/temi_ajao</code></li>
              <li><code>Twitter: @temii_ajao (10300 followers) - x.com/temii_ajao</code></li>
              <li><code>Facebook: @Temi Ajao (2200 followers) - https://www.facebook.com/share/1Fs6mW18zN</code></li>
              <li><code>YouTube: @temiajao_tsg (1650 followers) - https://youtube.com/@temiajao_tsg</code></li>
            </ul>
          </div>
          <div className="mt-3">
            <h6>Example Platform Formats:</h6>
            <ul className="small">
              <li><code>Twitter: @inc051 (32000 followers) - x.com/inc051</code></li>
              <li><code>Twitter: @lennycliff01 (19000 followers) - x.com/lennycliff01</code></li>
              <li><code>Instagram: @influencer_name (50000 followers) - instagram.com/influencer_name</code></li>
            </ul>
          </div>
          <p><a href="/sample-influencer-template.xlsx" download>Download Sample Template</a></p>
        </div>
      </Card.Body>
    </Card>
  );
};

export default InfluencerUpload;
