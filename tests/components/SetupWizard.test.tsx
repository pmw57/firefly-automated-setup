import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { screen, fireEvent } from '@testing-library/react';
import { render } from '../test-utils';
import SetupWizard from '../../components/SetupWizard';

describe('components/SetupWizard', () => {

  beforeEach(() => {
    localStorage.clear();
    // IntersectionObserver isn't available in test environment
    const mockIntersectionObserver = vi.fn();
    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null
    });
    window.IntersectionObserver = mockIntersectionObserver;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });
  
  it('renders the initial CaptainSetup step', async () => {
    render(<SetupWizard />);
    expect(await screen.findByText('Mission Configuration')).toBeInTheDocument();
    expect(screen.getByText('Number of Captains')).toBeInTheDocument();
  });

  it('progresses to the next step when "Next" is clicked', async () => {
    render(<SetupWizard />);
    
    // Step 1: CaptainSetup
    const nextButton1 = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton1);

    // Step 2: SetupCardSelection
    expect(await screen.findByText('Select Setup Card')).toBeInTheDocument();
    
    // Because 10th anniversary is on by default, we go to optional rules
    const nextButton2 = await screen.findByRole('button', { name: /Next: Optional Rules/i });
    fireEvent.click(nextButton2);

    // Step 3: OptionalRulesSelection
    expect(await screen.findByRole('heading', { level: 2, name: /Optional Rules/i })).toBeInTheDocument();
    const nextButton3 = screen.getByRole('button', { name: /Begin Setup Sequence/i });
    fireEvent.click(nextButton3);
    
    // Step 4: Core step
    expect(await screen.findByRole('heading', { name: /1\.\s*Nav Decks/i })).toBeInTheDocument();
  });

  it('can navigate back to a previous step', async () => {
    render(<SetupWizard />);
    
    const nextButton1 = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton1);

    const backButton = await screen.findByRole('button', { name: /← Back/i });
    fireEvent.click(backButton);

    expect(await screen.findByText('Mission Configuration')).toBeInTheDocument();
  });
  
  it('resets the game state when "Restart" is clicked and confirmed', async () => {
    render(<SetupWizard />);
    
    // Navigate to step 2
    const nextButton = await screen.findByRole('button', { name: /Next: Choose Setup Card/i });
    fireEvent.click(nextButton);
    expect(await screen.findByText('Select Setup Card')).toBeInTheDocument();

    // Trigger restart flow
    const restartButton = screen.getByRole('button', { name: /Restart/i });
    fireEvent.click(restartButton);

    const confirmButton = await screen.findByRole('button', { name: /Confirm Restart?/i });
    fireEvent.click(confirmButton);

    // Verify reset by checking if we are back at the first step
    expect(await screen.findByText('Mission Configuration')).toBeInTheDocument();
    expect(screen.queryByText('Select Setup Card')).not.toBeInTheDocument();
  });

  it('interacts correctly with the Optional Rules step', async () => {
    render(<SetupWizard />);
    
    // Go to Solo mode to enable all options.
    fireEvent.click(screen.getByRole('button', { name: /Decrease player count/i }));
    await screen.findByText('3');
    fireEvent.click(screen.getByRole('button', { name: /Decrease player count/i }));
    await screen.findByText('2');
    fireEvent.click(screen.getByRole('button', { name: /Decrease player count/i }));
    
    expect(await screen.findByText(/\(Solo Mode\)/)).toBeInTheDocument();

    // Navigate to Optional Rules step
    fireEvent.click(screen.getByRole('button', { name: /Next: Choose Setup Card/i }));

    const nextButton = await screen.findByRole('button', { name: /Next: Optional Rules/i });
    fireEvent.click(nextButton);
    
    expect(await screen.findByRole('heading', { name: /Optional Rules/i })).toBeInTheDocument();
    
    // Verify 10th anniversary rules are present (default state)
    expect(screen.getByRole('heading', { name: /10th Anniversary Rules/i })).toBeInTheDocument();
    // Verify Solo rules are present
    expect(screen.getByRole('heading', { name: /Solo Rules/i })).toBeInTheDocument();

    // Interact with a checkbox and check its state
    const shipUpgradesContainer = screen.getByText('Optional Ship Upgrades').closest('div[role="checkbox"]');
    expect(shipUpgradesContainer?.querySelector('svg')).toBeNull(); // Not checked
    fireEvent.click(shipUpgradesContainer!);
    // After clicking, the component re-renders. We need to wait for the change.
    // A simple way is to re-find the element or text that is constant.
    await screen.findByText('Optional Ship Upgrades');
    expect(shipUpgradesContainer?.querySelector('svg')).toBeInTheDocument(); // Checked

    // Interact with a solo checkbox
    const noSureThingsContainer = screen.getByText('No Sure Things In Life').closest('div[role="checkbox"]');
    expect(noSureThingsContainer?.querySelector('svg')).toBeNull();
    fireEvent.click(noSureThingsContainer!);
    await screen.findByText('No Sure Things In Life');
    expect(noSureThingsContainer?.querySelector('svg')).toBeInTheDocument(); // Checked
  });

  describe('Complex Flow: Flying Solo + The Browncoat Way', () => {
    it('navigates the flow and shows correct steps', async () => {
        render(<SetupWizard />);

        // --- Step 1: Captain Setup ---
        // Switch to solo mode
        const decreaseButton = await screen.findByRole('button', { name: /Decrease player count/i });
        fireEvent.click(decreaseButton); // 3
        fireEvent.click(decreaseButton); // 2
        fireEvent.click(decreaseButton); // 1
        expect(await screen.findByText('(Solo Mode)')).toBeInTheDocument();

        // Click next
        fireEvent.click(screen.getByRole('button', { name: /Next: Choose Setup Card/i }));

        // --- Step 2: Setup Card Selection ---
        // Verify Flying Solo is auto-selected, as this is now the default for Solo + 10th AE.
        const flyingSoloToggle = await screen.findByRole('switch', { name: /Flying Solo/i });
        expect(flyingSoloToggle).toBeChecked();

        // Select The Browncoat Way to pair with it
        const browncoatWayButton = await screen.findByRole('button', { name: /The Browncoat Way/i });
        fireEvent.click(browncoatWayButton);
        
        // Click next
        fireEvent.click(screen.getByRole('button', { name: /Next: Optional Rules/i }));

        // --- Step 3: Optional Rules ---
        // Just click through
        const beginButton = await screen.findByRole('button', { name: /Begin Setup Sequence/i });
        fireEvent.click(beginButton);
        
        // --- Core Steps ---
        // The combined flow for FS+BCW should include the unique "Starting Capitol" step
        
        // The first core step is choosing a story. We must select one to proceed.
        await screen.findByRole('heading', { name: /First, Choose a Story Card/i });
        // Select a non-solo story to make sure filtering works; "Harken's Folly" is a good base game option.
        fireEvent.click(await screen.findByRole('button', { name: /Harken's Folly/i }));
        
        // In this solo mode, the next button takes us to solo options within the same step.
        fireEvent.click(screen.getByRole('button', { name: /Next: Options/i }));

        // Now we are on the solo options sub-step. The heading should change.
        expect(await screen.findByRole('heading', { name: /Story Options/i })).toBeInTheDocument();

        // The button to proceed to the next main step is now available.
        fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

        // Click through the next steps to get to the one we want to test.
        await screen.findByRole('heading', { name: /2\.\s*Nav Decks/i });
        fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
        await screen.findByRole('heading', { name: /3\.\s*Alliance & Reaver Ships/i });
        fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
        
        // Now, assert that we have arrived at the "Starting Capitol" step.
        const startingCapitolStep = await screen.findByRole('heading', { name: /4\.\s*Starting Capitol/i });
        expect(startingCapitolStep).toBeInTheDocument();
        expect(screen.getByText(/Each Player's Starting Capitol/i)).toBeInTheDocument();
    });
  });

  describe('Complex Flow: Home Sweet Haven', () => {
    it('navigates the flow and shows correct dynamic steps', async () => {
        render(<SetupWizard />);

        // --- Step 1: Captain Setup ---
        fireEvent.click(await screen.findByRole('button', { name: /Next: Choose Setup Card/i }));

        // --- Step 2: Setup Card Selection ---
        // Select Home Sweet Haven
        fireEvent.click(await screen.findByRole('button', { name: /Home Sweet Haven/i }));
        fireEvent.click(screen.getByRole('button', { name: /Next: Optional Rules/i }));

        // --- Step 3: Optional Rules ---
        fireEvent.click(await screen.findByRole('button', { name: /Begin Setup Sequence/i }));
        
        // --- Core Steps ---
        // 1. D_FIRST_GOAL (MissionDossierStep)
        await screen.findByRole('heading', { name: /First, Choose a Story Card/i });
        fireEvent.click(await screen.findByRole('button', { name: /Harken's Folly/i }));
        fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));

        // 2. C1 (Nav Decks)
        await screen.findByRole('heading', { name: /2\.\s*Nav Decks/i });
        fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
        
        // 3. C2 (Alliance & Reaver Ships)
        await screen.findByRole('heading', { name: /3\.\s*Alliance & Reaver Ships/i });
        fireEvent.click(screen.getByRole('button', { name: /Next Step/i }));
        
        // 4. D_HAVEN_DRAFT (DraftStep)
        const draftStep = await screen.findByRole('heading', { name: /4\.\s*Choose Leaders, Havens & Ships/i });
        expect(draftStep).toBeInTheDocument();
        // Check for content specific to this dynamic step, rendered inside DraftStep
        expect(screen.getByRole('button', { name: /Roll for Haven Draft/i })).toBeInTheDocument();
    });
  });
});