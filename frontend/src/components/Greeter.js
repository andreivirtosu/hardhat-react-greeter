import React from "react";
import { Button, Spinner } from "react-bootstrap";
import { useState } from "react";

export function Greeter({ fetchedGreeting, fetchGreeting, setGreeting }) {
  const [greetingInput, setGreetingInput] = useState("");

  const [loading, setLoading] = useState("");

  async function _setGreetingHandler() {
    setLoading(true);
    await setGreeting(greetingInput);
    setGreetingInput("");
    setLoading(false);
  }

  return (
    <div className="container-md">
      <div className="row mb-3">
        <div className="col-sm-4 ">
          <Button variant="success" onClick={fetchGreeting}>
            Fetch greeting
          </Button>
        </div>
        <div className="col-sm text-start">{fetchedGreeting}</div>
      </div>

      <div className="row">
        <div className="col-sm-4">
          <Button
            variant="danger"
            disabled={loading}
            onClick={() => _setGreetingHandler()}
          >
            {loading && (
              <Spinner
                as="span"
                variant="light"
                size="sm"
                role="status"
                aria-hidden="true"
                animation="border"
              />
            )}
            Set greeting
          </Button>
        </div>
        <div className="col-sm text-start">
          <input
            placeholder="Greeting Placeholder"
            onChange={(e) => setGreetingInput(e.target.value)}
            value={greetingInput}
          />
        </div>
      </div>
    </div>
  );
}
