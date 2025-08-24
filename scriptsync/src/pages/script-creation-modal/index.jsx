import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Icon from '../../components/AppIcon';
import ScriptBasicInfo from './components/ScriptBasicInfo';
import TagsInput from './components/TagsInput';
import PrivacySettings from './components/PrivacySettings';
import CollaboratorInvitation from './components/CollaboratorInvitation';
import AdvancedSettings from './components/AdvancedSettings';
import ModalFooter from './components/ModalFooter';
import { scriptsService } from '../../services/scripts';

const ScriptCreationModal = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    tags: [],
    privacy: 'private',
    collaborators: [],
    advancedSettings: {
      template: 'blank',
      pageFormat: 'standard',
      sceneStructure: 'single',
      autoSave: true,
      lineNumbers: false,
      characterHighlight: true
    }
  });
  const [errors, setErrors] = useState({});

  // Mock data
  const categories = [
    { value: 'screenplay', label: 'Screenplay', description: 'Feature film script' },
    { value: 'stage-play', label: 'Stage Play', description: 'Theater production script' },
    { value: 'tv-episode', label: 'TV Episode', description: 'Television episode script' },
    { value: 'short-film', label: 'Short Film', description: 'Short form screenplay' },
    { value: 'web-series', label: 'Web Series', description: 'Online series episode' },
    { value: 'documentary', label: 'Documentary', description: 'Documentary script' },
    { value: 'commercial', label: 'Commercial', description: 'Advertisement script' },
    { value: 'other', label: 'Other', description: 'Custom script type' }
  ];

  const tagSuggestions = [
    'Drama', 'Comedy', 'Action', 'Thriller', 'Horror', 'Romance', 'Sci-Fi', 'Fantasy',
    'Mystery', 'Adventure', 'Crime', 'Historical', 'Biographical', 'Musical', 'Animation',
    'Family', 'War', 'Western', 'Superhero', 'Psychological', 'Dark Comedy', 'Indie'
  ];

  const steps = [
    { id: 1, title: 'Basic Info', icon: 'FileText' },
    { id: 2, title: 'Settings', icon: 'Settings' },
    { id: 3, title: 'Collaboration', icon: 'Users' }
  ];

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, []);

  const handleInputChange = (name, value) => {
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user starts typing
    if (errors?.[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleTagsChange = (tags) => {
    setFormData(prev => ({
      ...prev,
      tags
    }));
  };

  const handleCollaboratorsChange = (collaborators) => {
    setFormData(prev => ({
      ...prev,
      collaborators
    }));
  };

  const handleAdvancedSettingsChange = (settings) => {
    setFormData(prev => ({
      ...prev,
      advancedSettings: settings
    }));
  };

  const validateCurrentStep = () => {
    const newErrors = {};

    if (currentStep === 1) {
      if (!formData?.title?.trim()) {
        newErrors.title = 'Script title is required';
      } else if (formData?.title?.length < 3) {
        newErrors.title = 'Title must be at least 3 characters long';
      }

      if (!formData?.category) {
        newErrors.category = 'Please select a category';
      }
    }

    if (currentStep === 2) {
      if (!formData?.privacy) {
        newErrors.privacy = 'Please select privacy settings';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors)?.length === 0;
  };

  const handleNext = () => {
    if (validateCurrentStep()) {
      setCurrentStep(prev => Math.min(prev + 1, 3));
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = async () => {
    if (!validateCurrentStep()) return;

    setIsLoading(true);

    try {
      // Create script object for API
      const scriptData = {
        title: formData?.title,
        category: formData?.category,
        tags: formData?.tags,
        privacy: formData?.privacy,
        settings: formData?.advancedSettings
      };

      // Call API to create script
      const response = await scriptsService.createScript(scriptData);
      
      if (response.success) {
        // Navigate to script editor with new script ID
        navigate(`/script-editor/${response.data.script.id}`);
      } else {
        setErrors({ submit: response.message || 'Failed to create script. Please try again.' });
      }
    } catch (error) {
      // Fallback to localStorage if API fails
      try {
        const newScript = {
          id: `local_${Date.now()}`,
          title: formData?.title,
          category: formData?.category,
          tags: formData?.tags,
          privacy: formData?.privacy,
          settings: formData?.advancedSettings,
          content: '',
          status: 'draft',
          createdAt: new Date().toISOString(),
          lastModified: new Date().toISOString(),
          isLocal: true
        };
        
        // Store in localStorage
        localStorage.setItem(`script_${newScript.id}`, JSON.stringify(newScript));
        
        // Update local scripts list
        const localScripts = JSON.parse(localStorage.getItem('localScripts') || '[]');
        localScripts.push(newScript);
        localStorage.setItem('localScripts', JSON.stringify(localScripts));
        
        // Navigate to script editor
        navigate(`/script-editor/${newScript.id}`);
      } catch (fallbackError) {
        setErrors({ submit: 'Failed to create script. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/writer-dashboard');
  };

  const handleOverlayClick = (e) => {
    if (e?.target === e?.currentTarget) {
      handleCancel();
    }
  };

  const canSubmit = formData?.title?.trim() && formData?.category && formData?.privacy;

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <ScriptBasicInfo
              formData={formData}
              onInputChange={handleInputChange}
              errors={errors}
              categories={categories}
            />
            <TagsInput
              tags={formData?.tags}
              onTagsChange={handleTagsChange}
              suggestions={tagSuggestions}
              error={errors?.tags}
            />
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <PrivacySettings
              selectedPrivacy={formData?.privacy}
              onPrivacyChange={(privacy) => handleInputChange('privacy', privacy)}
              error={errors?.privacy}
            />
            <AdvancedSettings
              settings={formData?.advancedSettings}
              onSettingsChange={handleAdvancedSettingsChange}
              error={errors?.advancedSettings}
            />
          </div>
        );
      case 3:
        return (
          <CollaboratorInvitation
            collaborators={formData?.collaborators}
            onCollaboratorsChange={handleCollaboratorsChange}
            error={errors?.collaborators}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div 
      className="fixed inset-0 z-1000 flex items-center justify-center p-4 bg-background"
      onClick={handleOverlayClick}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-background/80 backdrop-blur-lg" />
      {/* Modal */}
      <div className="relative w-full max-w-4xl max-h-[90vh] glass-effect-hover border border-border rounded-2xl shadow-elevated overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
              <Icon name="Zap" size={20} color="white" />
            </div>
            <div>
              <span className="text-lg font-heading font-bold text-foreground">
                ScriptSync
              </span>
              <p className="text-sm text-muted-foreground">
                Create New Script
              </p>
            </div>
          </div>
          <button
            onClick={handleCancel}
            className="p-2 rounded-lg transition-smooth hover:bg-white/5"
            disabled={isLoading}
          >
            <Icon name="X" size={20} className="text-muted-foreground" />
          </button>
        </div>

        {/* Progress Steps */}
        <div className="px-6 py-4 border-b border-border">
          <div className="flex items-center justify-between">
            {steps?.map((step, index) => (
              <div key={step?.id} className="flex items-center">
                <div className={`flex items-center space-x-2 ${
                  currentStep >= step?.id ? 'text-primary' : 'text-muted-foreground'
                }`}>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 transition-smooth ${
                    currentStep >= step?.id 
                      ? 'border-primary bg-primary/10' :'border-muted-foreground'
                  }`}>
                    {currentStep > step?.id ? (
                      <Icon name="Check" size={16} className="text-primary" />
                    ) : (
                      <Icon name={step?.icon} size={16} />
                    )}
                  </div>
                  <span className="hidden sm:block text-sm font-body font-medium">
                    {step?.title}
                  </span>
                </div>
                {index < steps?.length - 1 && (
                  <div className={`w-12 sm:w-20 h-0.5 mx-4 transition-smooth ${
                    currentStep > step?.id ? 'bg-primary' : 'bg-border'
                  }`} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[60vh]">
          {renderStepContent()}

          {errors?.submit && (
            <div className="mt-6 p-4 rounded-lg bg-destructive/10 border border-destructive/20">
              <p className="text-sm text-destructive font-body">{errors?.submit}</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-border">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-3 sm:space-y-0">
            {/* Step Navigation */}
            <div className="flex space-x-2">
              {currentStep > 1 && (
                <button
                  onClick={handlePrevious}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-4 py-2 rounded-lg border border-border transition-smooth hover:bg-white/5 disabled:opacity-50"
                >
                  <Icon name="ChevronLeft" size={16} />
                  <span className="font-body">Previous</span>
                </button>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-3">
              {currentStep < 3 ? (
                <button
                  onClick={handleNext}
                  disabled={isLoading}
                  className="flex items-center space-x-2 px-6 py-2 bg-primary text-primary-foreground rounded-lg transition-smooth hover:bg-primary/90 disabled:opacity-50 shadow-floating"
                >
                  <span className="font-body">Next</span>
                  <Icon name="ChevronRight" size={16} />
                </button>
              ) : (
                <ModalFooter
                  onCancel={handleCancel}
                  onSubmit={handleSubmit}
                  isLoading={isLoading}
                  canSubmit={canSubmit}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScriptCreationModal;