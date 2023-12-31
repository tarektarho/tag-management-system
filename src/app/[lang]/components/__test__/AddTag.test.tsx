import { fireEvent, render, screen, waitFor } from "@testing-library/react"
import AddTag from "../AddTag"
import * as API from "../../../../api/api"
import { IPageText } from "@/types/pageText"
import { getCurrentTimestamp } from "../../../../utils/index"


// Mock the generateUUID function
jest.mock('../../../../utils/index', () => ({
  getCurrentTimestamp: jest.fn().mockReturnValue(1692176950)
}))

// Mock the useRouter hook
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    refresh: jest.fn()
  })
}))

jest.mock('../../../../api/api', () => ({
  addTag: jest.fn()
}))

describe("AddTag", () => {
  // @ts-ignore
  const page: IPageText['page'] = {
    addTag: {
      addNewTag: 'Add New Tag', save: 'Save', typeHere: 'Type here...'
    },
    erorrs: {
      nameCannotBeEmpty: "Tag name cannot be empty"
    }
  }

  beforeAll(() => {
    jest.clearAllMocks()
  })

  it('opens the modal when button is clicked', () => {
    // @ts-ignore
    render(<AddTag text={page} />)
    const addButton = screen.getByTestId('open-add-new-tag-modal')

    // Check if the button is rendered
    expect(addButton).toBeInTheDocument()

    // Click the button
    fireEvent.click(addButton)

    // Check if the modal is rendered
    const modalElement = screen.getByTestId("modal-container")
    expect(modalElement).toBeInTheDocument()
  })

  it("adds a new tag when form is submitted", async () => {
    const mockTagName = 'New Tag!'
    // @ts-ignore
    API.addTag.mockResolvedValueOnce()

    render(<AddTag text={page} />)
    const addButton = screen.getByTestId('open-add-new-tag-modal')

    // Open the modal
    fireEvent.click(addButton)

    // Fill and submit the form
    const inputElement = screen.getByPlaceholderText('Type here...')
    fireEvent.change(inputElement, { target: { value: mockTagName } })

    const submitButton = screen.getByText('Save')
    fireEvent.click(submitButton)

    // Check if the addTag function was called with the correct parameters
    await waitFor(() => {
      expect(API.addTag).toHaveBeenCalledWith({
        id: '0',
        name: mockTagName,
        deleted: false,
        createdAt: getCurrentTimestamp(),
        updatedAt: getCurrentTimestamp()
      })
    })

    // Check if the modal is closed
    const modalElement = screen.queryByRole("dialog")
    expect(modalElement).not.toBeInTheDocument()

  })

  it('throws an error when tag name is empty', async () => {
    // @ts-ignore
    API.addTag.mockRejectedValueOnce()
    render(<AddTag text={page} />)
    const addButton = screen.getByTestId('open-add-new-tag-modal')

    // Open the modal
    fireEvent.click(addButton)

    // Fill and submit the form
    const inputElement = screen.getByPlaceholderText('Type here...')
    fireEvent.change(inputElement, { target: { value: "" } })

    const submitButton = screen.getByText('Save')
    fireEvent.click(submitButton)

    // Check if the error message is displayed
    const errorMessage = screen.getByText("Tag name cannot be empty")
    expect(errorMessage).toBeInTheDocument()

  })
})
