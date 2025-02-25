import React from 'react';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import userEvent from '@testing-library/user-event';
import ContactForm from './ContactForm';

beforeEach(() => {
    render(<ContactForm />)
})

afterEach(() => {
    window.localStorage.clear()
})

describe('Contact Form Component', () => {
    test('renders without errors', () => {

    });

    test('renders the contact form header', () => {
        const heading = screen.queryByText('Contact Form')
        expect(heading).toHaveTextContent('Contact Form')
        expect(heading).toBeInTheDocument()
        expect(heading).toBeTruthy()
    });

    test('renders ONE error message if user enters less then 5 characters into firstname.', async () => {
        const firstNameInput = screen.getByPlaceholderText('Edd')
        fireEvent.change(firstNameInput, {target:{value:'cam'}})
        const errorMessage = await screen.findAllByTestId('error')
        expect(errorMessage).toHaveLength(1)
    });

    test('renders THREE error messages if user enters no values into any fields.', async () => {
        const submitButton = screen.getByRole('button')
        fireEvent.click(submitButton)

        const errorMessage = await screen.queryAllByTestId('error')
        expect(errorMessage).toHaveLength(3)

    });

    test('renders ONE error message if user enters a valid first name and last name but no email.', async () => {
        const firstNameInput = screen.getByPlaceholderText('Edd')
        const lastNameInput = screen.getByPlaceholderText('Burke')
        const submitButton = screen.getByRole('button') 
       
        fireEvent.change(firstNameInput, {target:{value:'Cameron'}})
        fireEvent.change(lastNameInput, {target:{value:'Yam'}})
        fireEvent.click(submitButton)

        const errorMessage = await screen.queryAllByTestId('error')
        expect(errorMessage).toHaveLength(1)
    });

    test('renders "email must be a valid email address" if an invalid email is entered', async () => {
        const emailInput = screen.getByPlaceholderText('bluebill1049@hotmail.com')

        fireEvent.change(emailInput, {target:{value:'cam'}})

        const errorMessage = await screen.findByText(/email must be a valid email address./i)
        expect(errorMessage).toBeInTheDocument()
    });

    test('renders "lastName is a required field" if an last name is not entered and the submit button is clicked', async () => {
        const submitButton = screen.getByRole('button') 

        fireEvent.click(submitButton)

        const errorMessage = await screen.findByText(/lastName is a required field./i)
        expect(errorMessage).toBeInTheDocument()

    });

    test('renders all firstName, lastName and email text when submitted. Does NOT render message if message is not submitted.', async () => {
        const firstNameInput = screen.getByPlaceholderText('Edd')
        const lastNameInput = screen.getByPlaceholderText('Burke')
        const emailInput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
        const submitButton = screen.getByRole('button') 

        fireEvent.change(firstNameInput, {target:{value:'Cameron'}})
        fireEvent.change(lastNameInput, {target:{value:'Yam'}})
        fireEvent.change(emailInput, {target:{value:'cam@gmail.com'}})
        fireEvent.click(submitButton)

        await waitFor(() => {
            const firstNameDisplay = screen.queryByText('Cameron')
            const lastNameDisplay = screen.queryByText('Yam')
            const emailDisplay= screen.queryByText('cam@gmail.com')
            const messageDisplay = screen.queryByTestId('messageDisplay')

            expect(firstNameDisplay).toBeInTheDocument()
            expect(lastNameDisplay).toBeInTheDocument()
            expect(emailDisplay).toBeInTheDocument()
            expect(messageDisplay).not.toBeInTheDocument()
        });

    });

    test('renders all fields text when all fields are submitted.', async () => {
        const firstNameInput = screen.getByPlaceholderText('Edd')
        const lastNameInput = screen.getByPlaceholderText('Burke')
        const emailInput = screen.getByPlaceholderText('bluebill1049@hotmail.com')
        const messageInput = screen.getByLabelText(/message/i)
        const submitButton = screen.getByRole('button') 

        fireEvent.change(firstNameInput, {target:{value:'Cameron'}})
        fireEvent.change(lastNameInput, {target:{value:'Yam'}})
        fireEvent.change(emailInput, {target:{value:'cam@gmail.com'}})
        fireEvent.change(messageInput, {target:{value:'dark'}})
        fireEvent.click(submitButton)

        await waitFor(() => {
            const firstNameDisplay = screen.queryByText('Cameron')
            const lastNameDisplay = screen.queryByText('Yam')
            const emailDisplay= screen.queryByText('cam@gmail.com')
            const messageDisplay = screen.queryByText('dark')

            expect(firstNameDisplay).toBeInTheDocument()
            expect(lastNameDisplay).toBeInTheDocument()
            expect(emailDisplay).toBeInTheDocument()
            expect(messageDisplay).toBeInTheDocument()
        });
    });
})