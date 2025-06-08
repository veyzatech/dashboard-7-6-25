// src/pages/Support.jsx
import React from "react";
import {
  Card,
  CardBody,
  Typography,
  Input,
  Button,
  Select,
  Option,
  Textarea,
} from "@material-tailwind/react";

export default function Support() {
  return (
    <div>
      <Typography variant="h4" className="mb-4">
        Veyza Support
      </Typography>

      {/* Form Card */}
      <Card className="mb-6 shadow-sm rounded-xl">
        <CardBody>
          <Typography variant="h6" className="mb-2">
            Need help? Please fill out the form below.
          </Typography>
          <form>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Left Column */}
              <div>
                <Input label="Vehicle Number" className="w-full" />
              </div>
              {/* Right Column */}
              <div>
                <Input label="Contact Name" className="w-full" />
              </div>

              <div>
                <Input label="Email" type="email" className="w-full" />
              </div>
              <div>
                <Input label="Contact Number" type="tel" className="w-full" />
              </div>

              <div>
                <Select label="Complaint Type" className="w-full">
                  <Option>App Issue</Option>
                  <Option>Device Issue</Option>
                  <Option>Payment</Option>
                  <Option>Other</Option>
                </Select>
              </div>
              <div>
                <Input label="Subject" className="w-full" />
              </div>

              {/* Description spans both columns */}
              <div className="md:col-span-2">
                <Textarea label="Description" className="w-full" />
              </div>

              {/* Buttons - also span both columns, right-aligned */}
              <div className="md:col-span-2 flex justify-end gap-4 mt-2">
                <Button color="red" variant="outlined" className="normal-case">
                  Reset
                </Button>
                <Button color="green" className="normal-case">
                  Submit
                </Button>
              </div>
            </div>
          </form>
        </CardBody>
      </Card>

      {/* Existing Tickets Card */}
      <Card className="shadow-sm rounded-xl">
        <CardBody>
          <Typography variant="h6" className="mb-4">
            Existing Tickets
          </Typography>
          <div className="overflow-x-auto">
            <table className="w-full min-w-max table-auto text-left">
              <thead>
                <tr className="bg-blue-gray-50">
                  <th className="p-3">Vehicle No</th>
                  <th className="p-3">Subject</th>
                  <th className="p-3">Status</th>
                  <th className="p-3">Date Created</th>
                </tr>
              </thead>
              <tbody>
                {/* Example rows, replace with dynamic data */}
                <tr className="even:bg-blue-gray-50/50">
                  <td className="p-3">V123</td>
                  <td className="p-3">Engine Issue</td>
                  <td className="p-3">Open</td>
                  <td className="p-3">2025-03-15</td>
                </tr>
                <tr className="even:bg-blue-gray-50/50">
                  <td className="p-3">V250</td>
                  <td className="p-3">Account Complaint</td>
                  <td className="p-3">Closed</td>
                  <td className="p-3">2025-03-10</td>
                </tr>
                {/* Add more rows as needed */}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}
